"use client";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Підтвердити",
  cancelText = "Скасувати",
  type = "danger",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const typeColors = {
    danger: {
      button: "bg-red-600 hover:bg-red-700 text-white",
      icon: "🗑️",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    warning: {
      button: "bg-yellow-600 hover:bg-yellow-700 text-white",
      icon: "⚠️",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    info: {
      button: "bg-blue-600 hover:bg-blue-700 text-white",
      icon: "ℹ️",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  };

  const colors = typeColors[type];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center mb-4">
          <div
            className={`${colors.iconBg} ${colors.iconColor} w-12 h-12 rounded-full flex items-center justify-center mr-4`}
          >
            <span className="text-xl">{colors.icon}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>

        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-md transition ${colors.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
