import crypto from "crypto";

interface LiqPayParams {
  public_key: string;
  private_key: string;
  sandbox?: boolean;
}

interface PaymentData {
  version: string;
  public_key: string;
  action: string;
  amount: number;
  currency: string;
  description: string;
  order_id: string;
  result_url: string;
  server_url: string;
  sandbox?: number;
}

export class LiqPay {
  private public_key: string;
  private private_key: string;
  private sandbox: boolean;

  constructor(params: LiqPayParams) {
    this.public_key = params.public_key;
    this.private_key = params.private_key;
    this.sandbox = params.sandbox || false;
  }

  // Generate payment form data
  cnb_form(params: PaymentData): { data: string; signature: string } {
    const data = this.cnb_params(params);
    const dataString = JSON.stringify(data);
    const base64Data = Buffer.from(dataString).toString("base64");
    const signature = this.str_to_sign(base64Data);

    console.log("Payment data:", data);
    console.log("Data string:", dataString);
    console.log("Base64 data:", base64Data);
    console.log("Generated signature:", signature);

    return {
      data: base64Data,
      signature: signature,
    };
  }

  // Generate payment parameters
  private cnb_params(params: PaymentData): PaymentData {
    const defaultParams: PaymentData = {
      version: "3",
      public_key: this.public_key,
      action: "pay",
      amount: 0,
      currency: "UAH",
      description: "",
      order_id: "",
      result_url: "",
      server_url: "",
      sandbox: this.sandbox ? 1 : 0,
    };

    return { ...defaultParams, ...params };
  }

  // Generate signature
  private str_to_sign(str: string): string {
    const sha1 = crypto.createHash("sha1");
    sha1.update(this.private_key + str + this.private_key);
    return sha1.digest("base64");
  }

  // Verify callback signature
  verify_signature(data: string, signature: string): boolean {
    const expected_signature = this.str_to_sign(data);
    console.log("Verifying signature:");
    console.log("Received signature:", signature);
    console.log("Expected signature:", expected_signature);
    console.log("Data:", data);
    return signature === expected_signature;
  }

  // Decode callback data
  decode_data(data: string): any {
    try {
      const decoded = Buffer.from(data, "base64").toString("utf8");
      return JSON.parse(decoded);
    } catch (error) {
      throw new Error("Invalid LiqPay data format");
    }
  }

  // Generate payment URL
  generate_payment_url(params: PaymentData): string {
    const { data, signature } = this.cnb_form(params);

    console.log("Data: ", data);
    console.log("Signature: ", signature);
    return `https://www.liqpay.ua/api/3/checkout?data=${encodeURIComponent(
      data
    )}&signature=${encodeURIComponent(signature)}`;
  }
}

// Create LiqPay instance with environment variables
export const liqpay = new LiqPay({
  public_key: process.env.LIQPAY_PUBLIC_KEY || "sandbox_i1234567890", // Replace with your public key
  private_key: process.env.LIQPAY_PRIVATE_KEY || "sandbox_private_key", // Replace with your private key
  sandbox: process.env.NODE_ENV !== "production", // Use sandbox in development
});
