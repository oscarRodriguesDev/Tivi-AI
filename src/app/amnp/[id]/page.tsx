'use client'
import { useState,useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface AnamneseData {
  nome: string;
  email: string;
  endereco: string;
  nascimento: string;
  idade: string;
  cpf: string;
  telefone: string;
  emergencia: string;
  generoOrientacao: string;
  estadoCivil: string;
  origemConhecimento: string;
  preocupacao: string;
  motivoAtendimento: string;
  experienciaAnterior: string;
  saudeFisica: string;
  detalhesSaudeFisica: string;
  medicamentos: string;
  diagnosticoMental: string;
  historicoFamiliar: string;
  rotina: string;
  sono: string;
  atividadeFisica: string;
  estresse: string;
  convivencia: string;
  relacaoFamiliar: string;
  apoioSocial: string;
  nivelFelicidade: string;
  ansiedade: string;
  pensamentosNegativos: string;
  objetivoTerapia: string;
  temasDelicados: string;
  estiloAtendimento: string;
  observacoesFinais: string;
  autorizacaoLGPD: boolean;
}

export default function FormularioAnamnese() {
  const { id } = useParams();

  const [form, setForm] = useState<AnamneseData>({
    nome: "",
    email: "",
    endereco: "",
    nascimento: "",
    idade: "",
    cpf: "",
    telefone: "",
    emergencia: "",
    generoOrientacao: "",
    estadoCivil: "",
    origemConhecimento: "",
    preocupacao: "",
    motivoAtendimento: "",
    experienciaAnterior: "",
    saudeFisica: "",
    detalhesSaudeFisica: "",
    medicamentos: "",
    diagnosticoMental: "",
    historicoFamiliar: "",
    rotina: "",
    sono: "",
    atividadeFisica: "",
    estresse: "",
    convivencia: "",
    relacaoFamiliar: "",
    apoioSocial: "",
    nivelFelicidade: "",
    ansiedade: "",
    pensamentosNegativos: "",
    objetivoTerapia: "",
    temasDelicados: "",
    estiloAtendimento: "",
    observacoesFinais: "",
    autorizacaoLGPD: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const router = useRouter();
  const [autorizado, setAutorizado] = useState<boolean | null>(null);

  useEffect(() => {
    async function verificarAcesso() {
      const res = await fetch(`/api/amnp/${id}`);
      if (res.ok) {
        setAutorizado(true);
      } else {
        setAutorizado(false);
        alert("Link expirado ou acesso não autorizado.");
        router.push("/acesso-negado"); // ou uma página de erro
      }
    }

    verificarAcesso();
  }, [id, router]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validação básica campos obrigatórios
    const {
      nome,
      email,
      nascimento,
      idade,
      cpf,
      preocupacao,
      motivoAtendimento,
    } = form;

    if (
      !nome.trim() ||
      !email.trim() ||
      !nascimento.trim() ||
      !idade.trim() ||
      !cpf.trim() ||
      !preocupacao.trim() ||
      !motivoAtendimento.trim()
    ) {
      setErrorMsg("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/analize_pcte", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || "Erro ao enviar o formulário.");
      } else {
        setSuccessMsg("Formulário enviado com sucesso!");
        setForm({
          nome: "",
          email: "",
          endereco: "",
          nascimento: "",
          idade: "",
          cpf: "",
          telefone: "",
          emergencia: "",
          generoOrientacao: "",
          estadoCivil: "",
          origemConhecimento: "",
          preocupacao: "",
          motivoAtendimento: "",
          experienciaAnterior: "",
          saudeFisica: "",
          detalhesSaudeFisica: "",
          medicamentos: "",
          diagnosticoMental: "",
          historicoFamiliar: "",
          rotina: "",
          sono: "",
          atividadeFisica: "",
          estresse: "",
          convivencia: "",
          relacaoFamiliar: "",
          apoioSocial: "",
          nivelFelicidade: "",
          ansiedade: "",
          pensamentosNegativos: "",
          objetivoTerapia: "",
          temasDelicados: "",
          estiloAtendimento: "",
          observacoesFinais: "",
          autorizacaoLGPD: false,
        });
      }
    } catch (error) {
      setErrorMsg("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Formulário de Anamnese</h1>

      <form className="space-y-10" onSubmit={handleSubmit}>
        {/* Seções do formulário */}
        {[
          {
            titulo: "1. Informações Pessoais",
            campos: [
              ["nome", "Nome completo"],
              ["email", "E-mail"],
              ["endereco", "Endereço (rua, cidade, estado, país)"],
              ["nascimento", "Data de nascimento"],
              ["idade", "Idade atual"],
              ["cpf", "CPF"],
              ["telefone", "Telefone"],
              ["emergencia", "Contato de emergência"],
              ["generoOrientacao", "Identidade de gênero/orientação sexual"],
              ["estadoCivil", "Estado civil"],
              ["origemConhecimento", "Como conheceu os serviços"],
            ],
          },
          {
            titulo: "2. Motivo do Atendimento",
            campos: [
              ["preocupacao", "Principal preocupação"],
              ["motivoAtendimento", "Motivo de busca pelo atendimento"],
              ["experienciaAnterior", "Experiência anterior com terapia"],
            ],
          },
          {
            titulo: "3. Histórico de Saúde",
            campos: [
              ["saudeFisica", "Possui condição de saúde física?"],
              ["detalhesSaudeFisica", "Detalhes da condição"],
              ["medicamentos", "Medicamentos em uso"],
              ["diagnosticoMental", "Diagnóstico de saúde mental"],
              ["historicoFamiliar", "Histórico familiar"],
            ],
          },
          {
            titulo: "4. Rotina e Hábitos",
            campos: [
              ["rotina", "Rotina diária"],
              ["sono", "Qualidade do sono"],
              ["atividadeFisica", "Atividade física e frequência"],
              ["estresse", "Lida com estresse"],
            ],
          },
          {
            titulo: "5. Contexto Familiar",
            campos: [
              ["convivencia", "Mora com alguém?"],
              ["relacaoFamiliar", "Relação com família"],
              ["apoioSocial", "Tem apoio social?"],
            ],
          },
          {
            titulo: "6. Saúde Mental",
            campos: [
              ["nivelFelicidade", "Nível de felicidade (0 a 10)"],
              ["ansiedade", "Frequência de ansiedade"],
              ["pensamentosNegativos", "Pensamentos autodestrutivos"],
            ],
          },
          {
            titulo: "7. Contexto Terapêutico",
            campos: [
              ["objetivoTerapia", "Objetivo da terapia"],
              ["temasDelicados", "Assuntos que prefere não falar agora"],
              ["estiloAtendimento", "Estilo de atendimento preferido"],
              ["observacoesFinais", "Observações finais"],
            ],
          },
        ].map((secao, index) => (
          <fieldset key={index} className="border p-4 rounded-lg">
            <legend className="text-lg font-semibold mb-4">{secao.titulo}</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {secao.campos.map(([campo, label]) => (
                <div key={campo}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  {(campo === "endereco" ||
                    campo === "emergencia" ||
                    label.length > 30) ? (
                    <textarea
                      name={campo}
                      value={(form as any)[campo]}
                      onChange={handleTextareaChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                      rows={3}
                      required={
                        ["nome", "email", "nascimento", "idade", "cpf", "preocupacao", "motivoAtendimento"].includes(campo)
                      }
                    />
                  ) : (
                    <input
                      name={campo}
                      value={(form as any)[campo]}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                      required={
                        ["nome", "email", "nascimento", "idade", "cpf", "preocupacao", "motivoAtendimento"].includes(campo)
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          </fieldset>
        ))}

        <fieldset className="border p-4 rounded-lg">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="autorizacaoLGPD"
              checked={form.autorizacaoLGPD}
              onChange={handleInputChange}
            />
            <span className="text-sm text-gray-700">
              Autorizo o uso dos meus dados conforme os termos da LGPD
            </span>
          </label>
        </fieldset>

        {errorMsg && (
          <p className="text-red-600 text-center font-semibold">{errorMsg}</p>
        )}
        {successMsg && (
          <p className="text-green-600 text-center font-semibold">{successMsg}</p>
        )}

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            } text-white font-semibold px-6 py-2 rounded-lg shadow`}
          >
            {loading ? "Enviando..." : "Enviar Formulário"}
          </button>
        </div>
      </form>
    </div>
  );
}
