"use client"

import Image from "next/image"
import { Github, Linkedin, Mail } from "lucide-react"
import eduardo from '../../../../public/equipe/eduardo.png'
import cassio from '../../../../public/equipe/cassio.png'
import tati from '../../../../public/equipe/tati.png'
import oscar from '../../../../public/equipe/oscar.png'

export default function EquipeSection() {
  return (
    <div className="container mx-auto px-4 py-16">


      {/* Equipe */}
      <div className="max-w-[80%] mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Nossa Equipe</h1>


        <div className="grid md:grid-cols-4 gap-8">

          {/* Tatiane Pontes */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-48 bg-tivi-tertiary flex items-center justify-center">
              <Image
                src={tati}
                alt="Tatiane Pontes"
                width={120}
                height={120}
                className="rounded-full border-4 border-white"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Tatiane Pontes</h2>
              <p className="text-tivi-primary mb-4">CEO</p>
              <p className="text-gray-600 mb-4">
                Idealizadora da solução. Especialista em psicologia clínica,
                é responsável pela validação das abordagens terapêuticas e pelo alinhamento ético e humanizado da plataforma.
                Lidera com visão estratégica e compromisso com o cuidado ao paciente.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-500 hover:text-tivi-primary">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-tivi-primary">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-tivi-primary">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>




          {/* Oscar */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-48 bg-tivi-tertiary flex items-center justify-center">
              <Image
                src={oscar}
                alt="Oscar Rodrigues"
                width={120}
                height={120}
                className="rounded-full border-4 border-white"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Oscar Rodrigues</h2>
              <p className="text-tivi-primary mb-4">Desenvolvedor Senior do Projeto</p>
              <p className="text-gray-600 mb-4">
                Especialista em inteligência artificial com foco em engenharia de prompt, linguagem natural e construção de experiências conversacionais.
                Atua no design de soluções inteligentes, combinando visão estratégica, criatividade e pensamento sistêmico.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-500 hover:text-tivi-primary">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-tivi-primary">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-tivi-primary">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>


          {/* Cassio */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-48 bg-tivi-tertiary flex items-center justify-center">
              <Image
                src={cassio}
                alt="Cassio Jordan"
                width={120}
                height={120}
                className="rounded-full border-4 border-white"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Cassio Jordan</h2>
              <p className="text-tivi-primary mb-4">Gestor de projeto PO</p>
              <p className="text-gray-600 mb-4">
                Responsável pela visão do produto e pelo alinhamento entre as
                necessidades dos usuários e os objetivos do negócio. Atua na priorização de
                funcionalidades e na definição estratégica da plataforma.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-500 hover:text-tivi-primary">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-tivi-primary">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-tivi-primary">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>


          {/* Eduardo */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-48 bg-tivi-tertiary flex items-center justify-center">
              <Image
                src={eduardo}
                alt="Eduardo Pontes"
                width={120}
                height={120}
                className="rounded-full border-4 border-white"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Eduardo Pontes</h2>
              <p className="text-tivi-primary mb-4"> Head de Suporte e
                Relacionamento</p>
              <p className="text-gray-600 mb-4">
                Responsável pela liderança das equipes de suporte e pelo fortalecimento do relacionamento com os usuários. Atua garantindo excelência no atendimento,
                escuta ativa e construção de conexões humanas com foco em confiança e continuidade.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-500 hover:text-tivi-primary">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-tivi-primary">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-tivi-primary">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>






        </div>






        {/* Missão */}
        <div className="mt-16 bg-tivi-light p-8 rounded-xl">
          <h2 className="text-2xl font-semibold mb-6 text-center">Nossa Missão</h2>
          <p className="text-gray-700 text-center mb-6">
            Transformar a prática da psicologia através da tecnologia, tornando-a mais eficiente, acessível e baseada em
            evidências, sem jamais perder o toque humano que é essencial para o processo terapêutico.
          </p>

          <div className="flex justify-center mt-4">
            <button
              onClick={() => {
                const element = document.getElementById("contato")
                if (element) {
                  window.scrollTo({
                    top: element.offsetTop - 64,
                    behavior: "smooth",
                  })
                }
              }}
              className="px-6 py-2 bg-tivi-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Junte-se à nossa missão
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
