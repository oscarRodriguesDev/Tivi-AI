"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import { FiClipboard } from "react-icons/fi"; // Ícone de copiar

interface PixPageProps {
  params: { brcode: any };
}

   export default function PixPage({ params }: PixPageProps) {
  const router = useRouter();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [secondsLeft, setSecondsLeft] = useState(180); // 3 minutos
  const brcode = Buffer.from(params.brcode, "base64").toString("utf-8");



  // Gera QR Code
  useEffect(() => {
    QRCode.toDataURL(brcode).then(setQrCodeUrl);
  }, [brcode]);


  // Contador regressivo
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
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


  //limpa os campos
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };


  //copiar o codigo do pix
  const handleCopy = () => {
    navigator.clipboard.writeText(brcode);
    alert("Código PIX copiado!");
  };



  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold text-[#117F43] mb-3">Pagamento Seguro PIX</h1>
      <p className="text-center max-w-md mb-6">
        Você está em um ambiente seguro para realizar o pagamento via PIX. Use o QR Code abaixo ou copie o código para concluir a transação.
      </p>

      {qrCodeUrl && (
        <div className="bg-white p-6 rounded-2xl mb-6 flex items-center justify-center shadow-lg border border-gray-200">
          <img src={qrCodeUrl} alt="QR Code PIX" className="w-64 h-64" />
        </div>
      )}

      <div className="flex items-center w-96 mb-6 border-2 border-[#117F43] rounded-lg bg-gray-100">
        <input
          type="text"
          readOnly
          className="flex-1 p-3 rounded-l-lg text-black outline-none"
          value={brcode}
        />
        <button
          onClick={handleCopy}
          className="px-4 py-3 bg-[#117F43] text-white rounded-r-lg hover:bg-green-600 transition flex items-center"
        >
          <FiClipboard size={20} />
        </button>
      </div>

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
