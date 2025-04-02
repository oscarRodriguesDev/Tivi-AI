import { useState } from "react";

interface Agendamento {
  id: string;
  name: string;
  data: string; // Formato: YYYY-MM-DD
}

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
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const agendamentosDoMes = agendamentos.filter((a) => {
    const data = new Date(a.data);
    return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
  });

  return (
    <div className="flex-col items-center justify-end ml-[30%] text-black p-4 rounded-xl shadow-2xl max-w-xl">
      <div className="flex mb-4">
        <button onClick={voltarMes} className="px-2 py-1 bg-blue-500 text-white rounded">← Anterior</button>
        <h2>{nomeMeses[mesAtual]} {anoAtual}</h2>
        <button onClick={avancarMes} className="px-2 py-1 bg-blue-500 text-white rounded">Próximo →</button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dia) => (
              <th key={dia} className="p-2 border">{dia}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {[...Array(Math.ceil((diasNoMes + primeiroDiaSemana) / 7))].map((_, semana) => (
            <tr key={semana}>
              {[...Array(7)].map((_, dia) => {
                const numeroDia = semana * 7 + dia - primeiroDiaSemana + 1;
                const temAgendamento = agendamentosDoMes.some(
                  (a) => new Date(a.data).getDate() === numeroDia
                );

                return (
                  <td
                    key={dia}
                    className={`p-4 border text-center ${
                      numeroDia > 0 && numeroDia <= diasNoMes
                        ? "cursor-pointer hover:bg-blue-300 " +
                          (temAgendamento ? "bg-blue-500 text-white" : "")
                        : "bg-gray-100"
                    }`}
                    onClick={() =>
                      numeroDia > 0 && numeroDia <= diasNoMes && onDayClick(numeroDia, mesAtual)
                    }
                  >
                    {numeroDia > 0 && numeroDia <= diasNoMes ? numeroDia : ""}
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
