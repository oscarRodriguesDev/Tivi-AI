import React from 'react';

type DocumentoModalProps = {
  onClose: () => void;
  onGenerate: () => void;
  onSelectTipo: (tipo: string) => void;
  tipoSelecionado?: string;
};

const tipos = ['DTP', 'RBT', '...'];

export const DocumentoModal: React.FC<DocumentoModalProps> = ({
  onClose,
  onGenerate,
  onSelectTipo,
  tipoSelecionado,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4">
    <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl border border-gray-200">
      <h2 className="text-xl font-bold text-center text-[#117E43] mb-4">
        Escolha o Documento desejado
      </h2>
  
      <div className="grid grid-cols-6 gap-3 justify-items-center mb-5">
        {['DTP', 'RBT','TRT','AV','RN','LDP','EP','ANMP','PT'].map((tipo) => (
          <button
            key={tipo}
            onClick={() => onSelectTipo(tipo)}
            className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all ${
              tipoSelecionado === tipo
                ? 'bg-[#117E43] text-white border-[#117E43] shadow'
                : 'bg-white text-[#117E43] border-[#117E43] hover:bg-[#117E43]/10'
            }`}
          >
            {tipo}
          </button>
        ))}
      </div>
  
      <div className="flex justify-end gap-4">
        <button
          onClick={onClose}
          className="border-2 border-[#117E43] text-[#117E43] font-medium px-4 py-2 rounded-lg hover:bg-[#117E43]/10 transition"
        >
          Cancelar
        </button>
        <button
          onClick={onGenerate}
          className="bg-[#117E43] text-white font-medium px-4 py-2 rounded-lg shadow hover:bg-[#0e6c3a] transition"
        >
          Gerar documento
        </button>
      </div>
    </div>
  </div>
  
  
  );
};
