"use client"

import { CheckCircle } from "lucide-react"

export default function HomeSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 64,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="bg-gradient-to-b from-white to-tivi-light">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            A plataforma inteligente que transforma suas consultas em resultados
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-10">
            Atenda online, transcreva com IA, e gere relatórios personalizados automaticamente
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => scrollToSection("contato")}
              className="px-8 py-3 bg-tivi-primary text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors shadow-lg"
            >
              Solicitar acesso beta
            </button>
            <button
              onClick={() => scrollToSection("comoFunciona")}
              className="px-8 py-3 bg-white text-tivi-primary border border-tivi-primary rounded-lg font-medium hover:bg-tivi-light transition-colors"
            >
              Como Funciona
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-gray-700">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-tivi-primary mr-2" />
              <span>Transcrição com Whisper</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-tivi-primary mr-2" />
              <span>Insights com GPT</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-tivi-primary mr-2" />
              <span>Conformidade LGPD</span>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Home Content */}
      <section className="container mx-auto px-4 py-16 bg-white rounded-t-3xl shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Transforme sua prática clínica com tecnologia</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-tivi-light p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-3">Economize Tempo</h3>
              <p>Reduza o tempo gasto em documentação e foque mais em seus pacientes.</p>
            </div>
            <div className="bg-tivi-light p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-3">Insights Valiosos</h3>
              <p>Obtenha análises detalhadas e padrões que podem passar despercebidos.</p>
            </div>
            <div className="bg-tivi-light p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-3">Segurança Total</h3>
              <p>Seus dados e de seus pacientes protegidos com criptografia de ponta a ponta.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
