"use client"

import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
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
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">TiviAi</h3>
            <p className="text-gray-600 mb-4">A plataforma inteligente que transforma suas consultas em resultados.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-tivi-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-tivi-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-tivi-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-tivi-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection("home")
                  }}
                  className="text-gray-600 hover:text-tivi-primary transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#sobre"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection("sobre")
                  }}
                  className="text-gray-600 hover:text-tivi-primary transition-colors"
                >
                  Sobre o Projeto
                </a>
              </li>
              <li>
                <a
                  href="#comoFunciona"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection("comoFunciona")
                  }}
                  className="text-gray-600 hover:text-tivi-primary transition-colors"
                >
                  Como Funciona
                </a>
              </li>
              <li>
                <a
                  href="#equipe"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection("equipe")
                  }}
                  className="text-gray-600 hover:text-tivi-primary transition-colors"
                >
                  Equipe
                </a>
              </li>
              <li>
                <a
                  href="#contato"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection("contato")
                  }}
                  className="text-gray-600 hover:text-tivi-primary transition-colors"
                >
                  Contato
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-tivi-primary transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-tivi-primary transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-tivi-primary transition-colors">
                  Conformidade LGPD
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-tivi-primary transition-colors">
                  Cookies
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <address className="not-italic text-gray-600">
              <p>Av. Paulista, 1000 - Bela Vista</p>
              <p>São Paulo - SP, 01310-100</p>
              <p className="mt-2">contato@tiviai.com.br</p>
              <p>(11) 4002-8922</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} TiviAi. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
