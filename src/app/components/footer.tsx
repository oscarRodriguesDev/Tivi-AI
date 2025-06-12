"use client"

import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, } from "react-icons/fa"
import Image from "next/image"
import logo from '../../../public/marca/logo.png'

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
            <div className="flex items-center gap-2">
              <Image src={logo} alt="logo da marca" className="w-8 h-auto" />
              <h3 className="text-lg font-semibold text-tivi-primary">TiviAi</h3>
            </div>

            <p className="text-gray-600 mb-4">Inteligencia que transforma vidas!</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-tivi-primary transition-colors">
                <FaFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-tivi-primary transition-colors">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/tiviai/?viewAsMember=true" className="text-gray-400 hover:text-tivi-primary transition-colors">
                <FaLinkedin className="h-5 w-5" />
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
                <a href="/terms-policies" className="text-gray-600 hover:text-tivi-primary transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="/terms-policies" className="text-gray-600 hover:text-tivi-primary transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="/terms-policies" className="text-gray-600 hover:text-tivi-primary transition-colors">
                  Conformidade LGPD
                </a>
              </li>
              <li>
                <a href="cookies-policies" className="text-gray-600 hover:text-tivi-primary transition-colors">
                  Cookies
                </a>
              </li>
            </ul>
          </div>

          <div>
   
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <address className="not-italic text-gray-600">
              <p>Av. Eldes Scherrer Souza, 975 - Parque Res. Laranjeiras</p>
              <p>Serra - ES, 29167-080</p>
              <p className="mt-2">admin@tiviai.com.br</p>
              <p>(27) 98872-8025</p>
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
