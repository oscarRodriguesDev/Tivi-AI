"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QrModalProps {
  qr?: string;
  onClose: () => void;
}

export default function QrModal({ qr, onClose }: QrModalProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  useEffect(() => {
    if (qr) {
      // gera o QR Code como data URL
      QRCode.toDataURL(qr)
        .then(url => setQrCodeDataUrl(url))
        .catch(err => console.error("Erro ao gerar QR Code:", err));
    }
  }, [qr]);

  if (!qr || !qrCodeDataUrl) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl p-8 w-80 max-w-full relative shadow-lg animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          ✖
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">Pagamento via QR Code</h2>
        <div className="flex justify-center mb-4">
          <img src={qrCodeDataUrl} alt="QR Code de Pagamento" className="w-48 h-48" />
        </div>
        <p className="text-center text-gray-600 text-sm">
          Escaneie o QR Code com seu aplicativo de pagamentos
        </p>
      </div>
    </div>
  );
}
