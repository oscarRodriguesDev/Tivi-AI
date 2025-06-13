import { useState } from "react";
import { Agendamento } from "../../../types/agendamentos";


interface ViewMesProps {
  agendamentos: Agendamento[];
  onDayClick: (day: number, month: number) => void;
}

const ViewMes: React.FC<ViewMesProps> = ({ agendamentos, onDayClick }) => {
  const [mesAtual, setMesAtual] = useState(new Date().getMonth());
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear());

  const avancarMes = () => {
    if (mesAtual === 11) {
      setMesAtual(0);
      setAnoAtual(anoAtual + 1);
    } else {
      setMesAtual(mesAtual + 1);
    }
  };

  const voltarMes = () => {
    if (mesAtual === 0) {
      setMesAtual(11);
      setAnoAtual(anoAtual - 1);
    } else {
      setMesAtual(mesAtual - 1);
    }
  };

  const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
  const primeiroDiaSemana = new Date(anoAtual, mesAtual, 1).getDay();

  const nomeMeses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  return (
    <div className="flex flex-col items-center justify-center text-black p-4 rounded-xl shadow-2xl w-full max-w-xl mx-auto">
      
      <div className="flex justify-between items-center w-full mb-4">
        <button onClick={voltarMes} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">← Anterior</button>
        <h2 className="text-xl font-semibold">{nomeMeses[mesAtual]} {anoAtual}</h2>
        <button onClick={avancarMes} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Próximo →</button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dia) => (
              <th key={dia} className="p-2 border text-sm font-medium text-gray-700">{dia}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(Math.ceil((diasNoMes + primeiroDiaSemana) / 7))].map((_, semanaIndex) => (
            <tr key={semanaIndex}>
              {[...Array(7)].map((_, diaIndex) => {
                const numeroDia = semanaIndex * 7 + diaIndex - primeiroDiaSemana + 1;

                const temAgendamento = agendamentos.some((a) => {
                  const [ano, mes, dia] = a.data.split('-').map(Number);
                  const data = new Date(ano, mes - 1, dia);
                  return (
                    data.getDate() === numeroDia &&
                    data.getMonth() === mesAtual &&
                    data.getFullYear() === anoAtual
                  );
                });
                
                const estaNoMes = numeroDia > 0 && numeroDia <= diasNoMes;

                return (
                  <td
                    key={diaIndex}
                    onClick={() => estaNoMes && onDayClick(numeroDia, mesAtual)}
                    className={`h-16 w-12 border text-center align-middle rounded-lg transition-all
                      ${estaNoMes ? 'cursor-pointer hover:bg-blue-100' : 'bg-gray-100 text-gray-400'}
                      ${temAgendamento ? 'bg-blue-500 text-white font-bold ring-2 ring-blue-700' : ''}
                    `}
                  >
                    {estaNoMes ? numeroDia : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewMes;
