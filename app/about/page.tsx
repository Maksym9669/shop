import { createClient } from "../../lib/supabase/server";

export default async function AboutPage() {
  const supabase = await createClient();
  const { data: products } = await supabase.from("products").select();

  console.log("Data: ", products);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Про магазин</h1>
      <p className="mt-4">Тут буде інформація про компанію та її історію.</p>
      {JSON.stringify(products, null, 2)}
    </div>
  );
}
