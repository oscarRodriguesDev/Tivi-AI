'use client';

import { useState } from 'react';

const AgendarReuniao = () => {
  const [nomeConvidado, setNomeConvidado] = useState('');
  const [linkReuniao, setLinkReuniao] = useState('');

  const gerarLink = () => {
    // Gerar o link de reunião baseado no nome do convidado
    const link = `call`;
    setLinkReuniao(link);

    // Redireciona para a página da reunião gerada
    window.location.href = `/${link}`;
  };

  return (
    <>
        <div className="min-h-screen flex justify-center items-center">
  <div className="max-w-md w-full p-6 bg-white shadow-md rounded-lg">
    <h1 className="text-2xl font-bold text-center mb-6">Agendar Reunião</h1>
    
    <button
      onClick={gerarLink}
      className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Acessar Reunião
    </button>
  </div>
</div>
    </>


  );
};

export default AgendarReuniao; 
