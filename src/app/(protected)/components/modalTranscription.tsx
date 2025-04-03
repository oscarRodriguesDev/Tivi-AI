type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    transcription: string;
  };
  
  export default function TranscriptionModal({ isOpen, onClose, transcription }: ModalProps) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative">
          {/* Botão de fechar */}
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            onClick={onClose}
          >
            ✖
          </button>
  
          {/* Conteúdo da transcrição interpretado como HTML */}
          <div className="overflow-y-auto max-h-[80vh]" dangerouslySetInnerHTML={{ __html: transcription }} />
        </div>
      </div>
    );
  }
  