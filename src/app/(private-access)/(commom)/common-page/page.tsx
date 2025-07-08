'use client';
import { useAccessControl } from "@/app/context/AcessControl";
import { FaUserMd, FaCalendarAlt, FaUsers, FaEnvelope, FaLightbulb } from "react-icons/fa";
import HeadPage from "@/app/(private-access)/components/headPage";
import { useSession } from "next-auth/react";
import { useHistory } from "@/app/context/historyContext";
import { use, useEffect } from "react";

const PaginaInicial = () => {
  const { role } = useAccessControl();
  const session = useSession();
  const { logAction } = useHistory();
  const id = session.data?.user?.id;

  const dadosMock = {
    consultasHoje: 4,
    pacientesAtivos: 12,
    mensagensNaoLidas: 3,
    dicaDoDia: "Lembre-se de registrar sempre suas séssoes com clareza e objetividade.",
  };



  return (
    <>

<div>
  <HeadPage title="Bem-vinda(o), Psicóloga(o)" icon={<FaUserMd size={20} />} />
  {role === "PSYCHOLOGIST" || role === "ADMIN" ? (
    <div className="px-4 py-6 space-y-6 max-w-5xl mx-auto">
      {/* Saudação */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow text-gray-800">
        <h2 className="text-lg sm:text-2xl font-semibold mb-2">
          Olá, {session.data?.user.name ?? "Profissional"} 👋
        </h2>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Que bom te ver por aqui! Esperamos que você tenha um dia produtivo e leve. Abaixo estão algumas informações rápidas para você começar:
        </p>
      </div>

      {/* Cards de informações */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-center gap-3">
          <FaCalendarAlt className="text-blue-600 text-3xl" />
          <div>
            <p className="text-xs sm:text-sm text-gray-500 uppercase font-medium tracking-wide">Consultas Hoje</p>
            <p className="text-xl font-bold">{dadosMock.consultasHoje}</p>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 p-4 rounded-2xl flex items-center gap-3">
          <FaUsers className="text-green-600 text-3xl" />
          <div>
            <p className="text-xs sm:text-sm text-gray-500 uppercase font-medium tracking-wide">Pacientes Ativos</p>
            <p className="text-xl font-bold">{dadosMock.pacientesAtivos}</p>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-2xl flex items-center gap-3">
          <FaEnvelope className="text-yellow-600 text-3xl" />
          <div>
            <p className="text-xs sm:text-sm text-gray-500 uppercase font-medium tracking-wide">Mensagens Não Lidas</p>
            <p className="text-xl font-bold">{dadosMock.mensagensNaoLidas}</p>
          </div>
        </div>
      </div>

      {/* Dica do dia */}
      <div className="bg-white p-5 rounded-2xl shadow flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <FaLightbulb className="text-yellow-500 text-4xl flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 text-lg">Dica do Dia</h3>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{dadosMock.dicaDoDia}</p>
        </div>
      </div>

      {/* Código de ética / lembrete */}
      <div className="bg-gray-100 border-l-4 border-gray-400 p-4 rounded-xl text-xs sm:text-sm text-gray-700">
        Lembre-se: todas as interações devem respeitar o <strong>Código de Ética do Psicólogo</strong>. Em caso de dúvida, consulte seu Conselho Regional.
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen text-gray-600 text-center px-4 text-sm sm:text-base">
      Essa página é acessível apenas para psicólogos.
    </div>
  )}
</div>


    </>
  );
};

export default PaginaInicial;
