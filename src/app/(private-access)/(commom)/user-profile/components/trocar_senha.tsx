import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import { Psicologo } from '../../../../../../types/psicologos';
import { showErrorMessage,showInfoMessage } from '@/app/util/messages';


interface Props extends Psicologo {
  onClose: () => void;
}

const AlteracaoSenha: React.FC<Props> = ({ id, email, nome, password, first_acess, onClose }) => {
  const [senhaAntiga, setSenhaAntiga] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [repetirSenha, setRepetirSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (novaSenha !== repetirSenha) {
      setErro('As senhas não coincidem!');
      return;
    }
    if (novaSenha.length < 6) {
      setErro('A nova senha deve ter pelo menos 6 caracteres!');
      return;
    }
    try {
      const senhaCriptografada = await bcrypt.hash(novaSenha, 10);
      const senhaAtualizada = {
        id,
        first_acess: false,
        password: senhaCriptografada,
      };
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
        showInfoMessage(sucesso)
        setTimeout(() => onClose(), 2000); // Fecha após sucesso
      } 
    } catch (error) {
      showErrorMessage(`Erro ao alterar senha: ${error}`);
      setErro('Erro ao alterar a senha. Tente novamente.');
    }
  };



  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-[#3D975B]/20 mx-4">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-[#3D975B] mb-2">Alteração de Senha</h2>
          <p className="text-gray-600 text-sm">
            Bem-vindo(a) à plataforma <span className="font-semibold">TiViAI</span>!<br />
            Como este é seu primeiro acesso, é necessário criar uma nova senha.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="senhaAntiga" className="block text-sm font-medium text-gray-700">Senha antiga</label>
            <input
              type="password"
              id="senhaAntiga"
              value={senhaAntiga}
              onChange={(e) => setSenhaAntiga(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3D975B]"
              required
            />
          </div>

          <div>
            <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-700">Nova senha</label>
            <input
              type="password"
              id="novaSenha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3D975B]"
              required
            />
          </div>

          <div>
            <label htmlFor="repetirSenha" className="block text-sm font-medium text-gray-700">Repetir nova senha</label>
            <input
              type="password"
              id="repetirSenha"
              value={repetirSenha}
              onChange={(e) => setRepetirSenha(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3D975B]"
              required
            />
          </div>

          {erro && <div className="text-red-600 text-sm">{erro}</div>}
          {sucesso && <div className="text-green-600 text-sm">{sucesso}</div>}

          <div className="pt-2 flex flex-col gap-3">
            <button
              type="submit"
              className="w-full py-2 bg-[#3D975B] text-white rounded-lg font-semibold hover:bg-[#337e4b] transition"
            >
              Alterar senha
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 border border-[#3D975B] text-[#3D975B] rounded-lg font-semibold hover:bg-[#3D975B]/10 transition"
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlteracaoSenha;
