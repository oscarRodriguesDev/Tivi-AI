import { Video, FileText, Lightbulb, Lock } from "lucide-react"

export default function ComoFuncionaSection() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Como Funciona</h1>

        <div className="mb-16">
          <div className="relative">
            <div className="absolute left-8 top-0 h-full w-0.5 bg-tivi-tertiary hidden md:block"></div>

            <div className="mb-12 md:pl-20 relative">
              <div className="absolute left-0 top-0 bg-tivi-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold hidden md:flex">
                1
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <Video className="h-8 w-8 text-tivi-primary mr-3" />
                  <h2 className="text-2xl font-semibold">Inicie a consulta por vídeo</h2>
                </div>
                <p className="text-gray-700 mb-4">
                  Realize atendimentos online através de nossa plataforma segura de videoconferência. A interface é
                  intuitiva e não requer instalação de software adicional.
                </p>
                <div className="bg-tivi-light p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Nossa plataforma de vídeo é otimizada para conexões de baixa velocidade e possui criptografia de
                    ponta a ponta para garantir a privacidade das sessões.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-12 md:pl-20 relative">
              <div className="absolute left-0 top-0 bg-tivi-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold hidden md:flex">
                2
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <FileText className="h-8 w-8 text-tivi-primary mr-3" />
                  <h2 className="text-2xl font-semibold">Transcrição automática com Whisper</h2>
                </div>
                <p className="text-gray-700 mb-4">
                  Após a sessão, nosso sistema utiliza a tecnologia Whisper da OpenAI para transcrever automaticamente
                  todo o conteúdo da consulta com alta precisão.
                </p>
                <div className="bg-tivi-light p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    O Whisper é capaz de reconhecer nuances da fala, diferentes sotaques e até mesmo identificar emoções
                    através de padrões vocais.
                  </p>
                </div>
              </div>
            </div>

            <div className="md:pl-20 relative">
              <div className="absolute left-0 top-0 bg-tivi-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold hidden md:flex">
                3
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <Lightbulb className="h-8 w-8 text-tivi-primary mr-3" />
                  <h2 className="text-2xl font-semibold">Geração de insights com GPT-4</h2>
                </div>
                <p className="text-gray-700 mb-4">
                  Com base na transcrição, nosso sistema utiliza o GPT-4 para analisar o conteúdo e gerar insights
                  valiosos, identificar padrões e sugerir abordagens terapêuticas.
                </p>
                <div className="bg-tivi-light p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Os insights gerados são baseados em evidências científicas e servem como suporte para o
                    profissional, que mantém total autonomia nas decisões clínicas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-tivi-light p-8 rounded-xl">
          <div className="flex items-center mb-6">
            <Lock className="h-6 w-6 text-tivi-primary mr-3" />
            <h2 className="text-2xl font-semibold">Segurança de Dados</h2>
          </div>
          <p className="mb-4">Garantimos a segurança e privacidade de todos os dados através de:</p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="bg-white p-1 rounded-full mr-2 mt-1">
                <div className="w-2 h-2 bg-tivi-primary rounded-full"></div>
              </div>
              <span>
                <strong>Anonimização via hash</strong> - Dados pessoais são protegidos através de técnicas avançadas de
                anonimização.
              </span>
            </li>
            <li className="flex items-start">
              <div className="bg-white p-1 rounded-full mr-2 mt-1">
                <div className="w-2 h-2 bg-tivi-primary rounded-full"></div>
              </div>
              <span>
                <strong>Criptografia de ponta a ponta</strong> - Todas as comunicações são criptografadas.
              </span>
            </li>
            <li className="flex items-start">
              <div className="bg-white p-1 rounded-full mr-2 mt-1">
                <div className="w-2 h-2 bg-tivi-primary rounded-full"></div>
              </div>
              <span>
                <strong>Conformidade com LGPD</strong> - Todos os processos seguem rigorosamente a Lei Geral de Proteção
                de Dados.
              </span>
            </li>
            <li className="flex items-start">
              <div className="bg-white p-1 rounded-full mr-2 mt-1">
                <div className="w-2 h-2 bg-tivi-primary rounded-full"></div>
              </div>
              <span>
                <strong>Armazenamento seguro</strong> - Utilizamos servidores com certificações de segurança
                internacionais.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
