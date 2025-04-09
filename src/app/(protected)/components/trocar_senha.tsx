import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import { Psicologo } from '../../../../types/psicologos';

const AlteracaoSenha: React.FC<Psicologo> = ({ id, email, name, password, first_acess }) => {
  const [senhaAntiga, setSenhaAntiga] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [repetirSenha, setRepetirSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [lastname, setLastname] = useState(''); 
  const [psicologo, setPsicologo] = useState<Psicologo>({
    id: id,
    name: name, 
    email:email, 
    password: password, 
    first_acess: first_acess,
    lastname: lastname,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (novaSenha !== repetirSenha) {
      setErro('As senhas não coincidem!');
      return;
    }

    if (novaSenha.length < 6) {
      setErro('A nova senha deve ter pelo menos 6 caracteres!');
      return;
    }

    try {
      // Criptografar a nova senha antes de enviar
      const senhaCriptografada = await bcrypt.hash(novaSenha, 10);

      // Apenas a senha será enviada para o backend
      const senhaAtualizada = {
        id,
        first_acess:false,
        password: senhaCriptografada, // Somente o campo senha é alterado
      };

      // Chamada ao endpoint para atualizar a senha
      const response = await fetch(`/api/user-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(senhaAtualizada),
      });

      if (response.ok) {
        setSucesso('Senha alterada com sucesso!');
        setErro('');
        setSenhaAntiga('');
        setNovaSenha('');
        setRepetirSenha('');
        

      } else {
        setErro('Erro ao alterar a senha. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao alterar a senha:', error);
      setErro('Erro ao alterar a senha. Tente novamente.');
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Alteração de Senha</h2>

      <div className="text-gray-700 mb-4">
        <p>Alteração de senha necessária!</p>
        <p>
          Verificamos que esse é seu primeiro acesso à plataforma TiViAI, por isso é necessário que você
          escolha uma nova senha para acessar nossos serviços.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="senhaAntiga" className="block text-sm font-medium text-gray-600">Senha Antiga</label>
          <input
            type="password"
            id="senhaAntiga"
            value={senhaAntiga}
            onChange={(e) => setSenhaAntiga(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-600">Nova Senha</label>
          <input
            type="password"
            id="novaSenha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="repetirSenha" className="block text-sm font-medium text-gray-600">Repetir Senha</label>
          <input
            type="password"
            id="repetirSenha"
            value={repetirSenha}
            onChange={(e) => setRepetirSenha(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>

        {erro && <div className="text-red-500 text-sm mb-4">{erro}</div>}
        {sucesso && <div className="text-green-500 text-sm mb-4">{sucesso}</div>}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded mt-4 hover:bg-blue-700"
        >
          Alterar Senha
        </button>
      </form>
    </div>
  );
};

export default AlteracaoSenha;
