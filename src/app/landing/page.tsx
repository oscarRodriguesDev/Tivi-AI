"use client"
 
import { useEffect, useRef, useState } from "react"
import HomeSection from "../components/sections/home-section"
import SobreSection from "../components/sections/sobre-section"
import ComoFuncionaSection from "../components/sections/como-funciona-section"
import EquipeSection from "../components/sections/equipe-section"
import ContatoSection from "../components/sections/contato-section" // Importando useEffect
import Navbar from "../components/navbar";
import Footer from "../components/footer"
import WhatsappButton from "../components/whatsapp-button"


export default function Home() {
  const [activeSection, setActiveSection] = useState("home")
  const sectionRefs = {
    home: useRef<HTMLDivElement>(null),
    sobre: useRef<HTMLDivElement>(null),
    comoFunciona: useRef<HTMLDivElement>(null),
    equipe: useRef<HTMLDivElement>(null),
    contato: useRef<HTMLDivElement>(null),
  }

  // Função para observar qual seção está visível
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id
            setActiveSection(id)
            // Atualiza a URL sem recarregar a página
            window.history.pushState(null, "", `#${id}`)
          }
        })
      },
      { threshold: 0.5 },
    )

    // Observa todas as seções
    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
      })
    }
  }, [])

  // Verifica se há um hash na URL ao carregar a página
  useEffect(() => {
    const hash = window.location.hash.replace("#", "")
    if (hash && sectionRefs[hash as keyof typeof sectionRefs]?.current) {
      setTimeout(() => {
        sectionRefs[hash as keyof typeof sectionRefs].current?.scrollIntoView({
          behavior: "smooth",
        })
      }, 100)
    }
  }, [])

  return (
    <div className="bg-white">
      <Navbar/>
      {/* Home Section */}
      <div id="home" ref={sectionRefs.home} className="min-h-screen pt-16">
        <HomeSection />
      </div>

      {/* Sobre Section */}
      <div id="sobre" ref={sectionRefs.sobre} className="min-h-screen pt-16">
        <SobreSection />
      </div>

      {/* Como Funciona Section */}
      <div id="comoFunciona" ref={sectionRefs.comoFunciona} className="min-h-screen pt-16">
        <ComoFuncionaSection />
      </div>

      {/* Equipe Section */}
      <div id="equipe" ref={sectionRefs.equipe} className="min-h-screen pt-16">
        <EquipeSection />
      </div>

      {/* Contato Section */}
      <div id="contato" ref={sectionRefs.contato} className="min-h-screen pt-16">
        <ContatoSection />
      </div>
      <WhatsappButton/>
      <div >
        <Footer />
      </div>

    </div>
  )
}
