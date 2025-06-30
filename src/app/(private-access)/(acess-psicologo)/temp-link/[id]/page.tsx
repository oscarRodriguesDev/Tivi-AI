'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function GerarLinkAnamnesePage() {
  const { id } = useParams();
  const psicologoId = id?.toString() ?? '';
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiado, setCopiado] = useState(false);

  async function gerarLink() {
    setLoading(true);
    setCopiado(false);
    setLink('');
    try {
      const res = await fetch('/api/internal/gerar-link-anamnese', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ psicologoId }),
      });
      const data = await res.json();
      if (res.ok) {
        setLink(data.link);
      } else {
        alert(data.error || 'Erro ao gerar link.');
      }
    } catch (err) {
      alert('Erro inesperado.');
    } finally {
      setLoading(false);
    }
  }
  async function copiarLink() {
    if (link) {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  }
  return (
    <>
      <div className="min-h-screen bg-white text-black flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl bg-gray-100 rounded-2xl shadow-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-center text-[#147D43] mb-6">
            Gerar Link de Anamnese
          </h1>

          <div className="space-y-6">
            <button
              onClick={gerarLink}
              disabled={loading || !psicologoId}
              className={`w-full bg-[#147D43] hover:bg-[#0f5e32] text-white font-semibold py-2 rounded-lg transition ${loading ? 'opacity-60 cursor-not-allowed' : ''
                }`}
            >
              {loading ? 'Gerando...' : 'Gerar Link'}
            </button>

            {link && (
              <div className="mt-6 p-4 bg-white border border-[#147D43] rounded-lg shadow-sm">
                <p className="text-sm mb-2 font-medium text-gray-700">Link gerado:</p>
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    readOnly
                    value={link}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-700"
                  />
                  <button
                    onClick={copiarLink}
                    className="bg-[#147D43] text-white px-4 py-1.5 rounded-lg text-sm hover:bg-[#0f5e32]"
                  >
                    {copiado ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
