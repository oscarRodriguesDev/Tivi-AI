"use client"

import { useState, useEffect } from "react"
import { Menu, X } from 'lucide-react'
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [isClient, setIsClient] = useState(false); // Controlar a renderização do cliente
    const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  // Atualiza a seção ativa com base no scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "sobre", "comoFunciona", "equipe", "contato"]

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 64, // Ajuste para a altura da navbar
        behavior: "smooth",
      })

      // Atualiza a URL sem recarregar a página
      window.history.pushState(null, "", `#${sectionId}`)
      setActiveSection(sectionId)
      closeMenu()
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("home")
            }}
            className="text-xl font-bold text-tivi-primary"
          >
            TiviAi
          </a>

          <nav className="hidden md:flex space-x-8">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("home")
              }}
              className={`transition-colors ${
                activeSection === "home" ? "text-tivi-primary" : "text-gray-700 hover:text-tivi-primary"
              }`}
            >
              Home
            </a>
            <a
              href="#sobre"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("sobre")
              }}
              className={`transition-colors ${
                activeSection === "sobre" ? "text-tivi-primary" : "text-gray-700 hover:text-tivi-primary"
              }`}
            >
              Sobre
            </a>
            <a
              href="#comoFunciona"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("comoFunciona")
              }}
              className={`transition-colors ${
                activeSection === "comoFunciona" ? "text-tivi-primary" : "text-gray-700 hover:text-tivi-primary"
              }`}
            >
              Como Funciona
            </a>
            <a
              href="#equipe"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("equipe")
              }}
              className={`transition-colors ${
                activeSection === "equipe" ? "text-tivi-primary" : "text-gray-700 hover:text-tivi-primary"
              }`}
            >
              Equipe
            </a>
            <a
              href="#contato"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("contato")
              }}
              className={`transition-colors ${
                activeSection === "contato" ? "text-tivi-primary" : "text-gray-700 hover:text-tivi-primary"
              }`}
            >
              Contato
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <a
              href="/login"
              className="px-4 py-2 border border-tivi-primary text-tivi-primary rounded-lg hover:bg-tivi-light transition-colors"
            >
              Entrar
            </a>
            <a
              href="#contato"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("contato")
              }}
              className="px-4 py-2 bg-tivi-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Preview Demo
            </a>
          </div>

          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <nav className="flex flex-col py-4">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("home")
              }}
              className={`px-4 py-2 hover:bg-tivi-light transition-colors ${
                activeSection === "home" ? "text-tivi-primary" : "text-gray-700"
              }`}
            >
              Home
            </a>
            <a
              href="#sobre"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("sobre")
              }}
              className={`px-4 py-2 hover:bg-tivi-light transition-colors ${
                activeSection === "sobre" ? "text-tivi-primary" : "text-gray-700"
              }`}
            >
              Sobre
            </a>
            <a
              href="#comoFunciona"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("comoFunciona")
              }}
              className={`px-4 py-2 hover:bg-tivi-light transition-colors ${
                activeSection === "comoFunciona" ? "text-tivi-primary" : "text-gray-700"
              }`}
            >
              Como Funciona
            </a>
            <a
              href="#equipe"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("equipe")
              }}
              className={`px-4 py-2 hover:bg-tivi-light transition-colors ${
                activeSection === "equipe" ? "text-tivi-primary" : "text-gray-700"
              }`}
            >
              Equipe
            </a>
            <a
              href="#contato"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("contato")
              }}
              className={`px-4 py-2 hover:bg-tivi-light transition-colors ${
                activeSection === "contato" ? "text-tivi-primary" : "text-gray-700"
              }`}
            >
              Contato
            </a>
            <div className="px-4 py-2 space-y-2">
              <a
                href="#"
                className="block w-full py-2 text-center border border-tivi-primary text-tivi-primary rounded-lg hover:bg-tivi-light transition-colors"
              >
                Entrar
              </a>
              <a
                href="#contato"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection("contato")
                }}
                className="block w-full py-2 text-center bg-tivi-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Preview Demo
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}