import { Clock, ClipboardList, MapPin, BarChart, Zap, FileText, Shield, Users } from "lucide-react"

export default function SobreSection() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Sobre o Projeto</h1>

        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">O Problema</h2>
          <p className="mb-6">
            O mercado de psicologia enfrenta desafios significativos que impactam tanto profissionais quanto pacientes:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Problema 1 */}
            <div className="bg-tivi-secondary p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-3">
                <div className="bg-white p-2 rounded-full mr-3 flex-shrink-0">
                  <Clock className="h-5 w-5 text-tivi-primary" />
                </div>
                <h3 className="font-semibold text-lg text-white">Tempo limitado</h3>
              </div>
              <p className="text-white ml-11">
                Profissionais gastam horas com documentação e relatórios, reduzindo o tempo disponível para atendimento
                e aprimoramento profissional.
              </p>
            </div>

            {/* Problema 2 */}
            <div className="bg-tivi-secondary p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-3">
                <div className="bg-white p-2 rounded-full mr-3 flex-shrink-0">
                  <ClipboardList className="h-5 w-5 text-tivi-primary" />
                </div>
                <h3 className="font-semibold text-lg text-white">Burocracia excessiva</h3>
              </div>
              <p className="text-white ml-11">
                Processos manuais que poderiam ser automatizados consomem recursos valiosos e aumentam a chance de
                erros.
              </p>
            </div>

            {/* Problema 3 */}
            <div className="bg-tivi-secondary p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-3">
                <div className="bg-white p-2 rounded-full mr-3 flex-shrink-0">
                  <MapPin className="h-5 w-5 text-tivi-primary" />
                </div>
                <h3 className="font-semibold text-lg text-white">Barreiras geográficas</h3>
              </div>
              <p className="text-white ml-11">
                Dificuldade em atender pacientes de regiões distantes, limitando o alcance dos profissionais e o acesso
                ao tratamento.
              </p>
            </div>

            {/* Problema 4 */}
            <div className="bg-tivi-secondary p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-3">
                <div className="bg-white p-2 rounded-full mr-3 flex-shrink-0">
                  <BarChart className="h-5 w-5 text-tivi-primary" />
                </div>
                <h3 className="font-semibold text-lg text-white">Análise superficial</h3>
              </div>
              <p className="text-white ml-11">
                Falta de ferramentas para análise aprofundada das sessões, dificultando a identificação de padrões e
                insights importantes.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Nossa Solução</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Solução 1 */}
            <div className="bg-tivi-tertiary p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-3">
                <div className="bg-white p-2 rounded-full mr-3 flex-shrink-0">
                  <Zap className="h-5 w-5 text-tivi-primary" />
                </div>
                <h3 className="font-semibold text-lg text-gray-800">Consultas Potencializadas por IA</h3>
              </div>
              <p className="text-gray-800 ml-11">
                Nossa plataforma integra tecnologias de ponta para transformar o atendimento psicológico, permitindo
                consultas online com transcrição automática e análise de conteúdo.
              </p>
            </div>

            {/* Solução 2 */}
            <div className="bg-tivi-tertiary p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-3">
                <div className="bg-white p-2 rounded-full mr-3 flex-shrink-0">
                  <FileText className="h-5 w-5 text-tivi-primary" />
                </div>
                <h3 className="font-semibold text-lg text-gray-800">Relatórios Automatizados</h3>
              </div>
              <p className="text-gray-800 ml-11">
                Geramos relatórios personalizados baseados nas sessões, destacando pontos importantes e sugerindo
                abordagens terapêuticas com base em evidências científicas.
              </p>
            </div>

            {/* Solução 3 */}
            <div className="bg-tivi-tertiary p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-3">
                <div className="bg-white p-2 rounded-full mr-3 flex-shrink-0">
                  <Shield className="h-5 w-5 text-tivi-primary" />
                </div>
                <h3 className="font-semibold text-lg text-gray-800">Criptografia e Privacidade</h3>
              </div>
              <p className="text-gray-800 ml-11">
                Todos os dados são criptografados e tratados conforme as melhores práticas de segurança e em total
                conformidade com a LGPD.
              </p>
            </div>

            {/* Solução 4 */}
            <div className="bg-tivi-tertiary p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-3">
                <div className="bg-white p-2 rounded-full mr-3 flex-shrink-0">
                  <Users className="h-5 w-5 text-tivi-primary" />
                </div>
                <h3 className="font-semibold text-lg text-gray-800">Acessibilidade</h3>
              </div>
              <p className="text-gray-800 ml-11">
                Democratizamos o acesso à tecnologia avançada para profissionais independentes e pequenas clínicas com
                um modelo de preço justo.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Público-Alvo</h2>
          <div className="bg-tivi-light p-6 rounded-xl">
            <p className="mb-4">Nossa plataforma foi desenvolvida pensando em:</p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-white p-2 rounded-full mr-3">
                  <span className="text-tivi-primary font-bold">1</span>
                </div>
                <div>
                  <strong>Psicólogos Clínicos</strong> - Profissionais que buscam otimizar seu tempo e melhorar a
                  qualidade dos atendimentos.
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-white p-2 rounded-full mr-3">
                  <span className="text-tivi-primary font-bold">2</span>
                </div>
                <div>
                  <strong>Clínicas de Psicologia</strong> - Estabelecimentos que desejam padronizar e elevar a qualidade
                  dos serviços oferecidos.
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-white p-2 rounded-full mr-3">
                  <span className="text-tivi-primary font-bold">3</span>
                </div>
                <div>
                  <strong>Profissionais Independentes</strong> - Psicólogos autônomos que precisam maximizar sua
                  eficiência e alcance.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
