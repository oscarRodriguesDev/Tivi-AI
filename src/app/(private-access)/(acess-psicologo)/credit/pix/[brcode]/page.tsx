"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


interface PixPageProps {
  params: { brcode: string }; // aqui o param será o qr_code_url
}

export default function PixPage({ params }: PixPageProps) {
  const router = useRouter();
  const qrCodeUrl = decodeURIComponent(params.brcode); // é o link do Pagar.me
  const [secondsLeft, setSecondsLeft] = useState(180);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/creditos");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold text-[#117F43] mb-3">Pagamento Seguro PIX</h1>
      <p className="text-center max-w-md mb-6">
        Escaneie o QR Code abaixo para concluir seu pagamento.
      </p>

      {qrCodeUrl && (
        <div className="bg-white p-6 rounded-2xl mb-6 flex items-center justify-center shadow-lg border border-gray-200">
          <img src={qrCodeUrl} alt="QR Code PIX Oficial" className="w-64 h-64" />
        </div>
      )}

      <div className="text-[#117F43] text-xl font-semibold mb-6">
        Tempo restante: {formatTime(secondsLeft)}
      </div>

      <button
        onClick={() => router.push("/creditos")}
        className="px-6 py-3 bg-[#117F43] text-white rounded-lg text-lg hover:bg-green-600 transition"
      >
        Voltar aos Créditos
      </button>
    </div>
  );
}
