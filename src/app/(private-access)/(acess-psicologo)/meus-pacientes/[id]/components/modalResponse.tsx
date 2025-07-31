import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

export default function GPTModal({ isOpen, onClose, content }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-[90%] max-h-[90vh] overflow-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">Análise Gerada</h2>
        <div className="whitespace-pre-wrap text-gray-800">
          {content}
        </div>
      </div>
    </div>
  );
}
