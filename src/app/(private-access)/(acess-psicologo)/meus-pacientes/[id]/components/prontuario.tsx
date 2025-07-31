'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Prontuario from '../../../../../../../types/prontuario';


interface Props {
  pacienteId: string;
  open: boolean;
  onClose: () => void;
}

export default function ProntuarioModal({ pacienteId, open, onClose }: Props) {
  const [prontuario, setProntuario] = useState<Prontuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    async function fetchProntuario() {
      setLoading(true);
      try {
        const res = await fetch(`/api/internal/prontuario?pacienteId=${pacienteId}`);
        if (!res.ok) throw new Error('Erro ao buscar prontuário');
        const data = await res.json();
        setProntuario(data);
      } catch (error) {
        console.error('Erro ao carregar prontuário:', error);
        setProntuario(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProntuario();
  }, [pacienteId, open]);

  if (!open) return null;

  return (

    <>

      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold mb-4 text-gray-800">Prontuário do Paciente</h2>

          {loading ? (
            <p>Carregando prontuário...</p>
          ) : !prontuario ? (
            <p>Nenhum prontuário encontrado.</p>
          ) : (
            <>
              <Info label="Queixa Principal" value={prontuario.queixaPrincipal} />
              <Info label="Histórico" value={prontuario.historico} />
              <Info label="Conduta" value={prontuario.conduta} />
              <Info label="Evolução" />
              <Info label="Transcrições" value={prontuario.transcription} />

              <div className="max-h-60 overflow-y-auto bg-gray-50 rounded-md p-3 border border-gray-200 whitespace-pre-line text-sm text-gray-800">
                {prontuario.evolucao}
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Última atualização: {new Date(prontuario.updatedAt).toLocaleString()}
              </p>
            </>

          )}
        </div>
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <>

      <div className="mb-3">
        <label className="block font-medium text-gray-600">{label}:</label>
        <p className="text-gray-800">{value || 'Não informado'}</p>
      </div>
    </>
  );
}
