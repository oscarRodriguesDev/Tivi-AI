"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export default function ContatoSection() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    mensagem: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulação de envio de formulário
    try {
      // Aqui seria a chamada para uma API real
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSubmitStatus("success")
      setFormData({ nome: "", email: "", mensagem: "" })
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Entre em Contato</h1>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Envie uma mensagem</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tivi-primary focus:border-tivi-primary outline-none transition-colors"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tivi-primary focus:border-tivi-primary outline-none transition-colors"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem
                </label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tivi-primary focus:border-tivi-primary outline-none transition-colors resize-none"
                  placeholder="Como podemos ajudar?"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 flex items-center justify-center rounded-lg text-white font-medium transition-colors ${
                  isSubmitting ? "bg-tivi-secondary cursor-not-allowed" : "bg-tivi-primary hover:bg-opacity-90"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar mensagem
                  </>
                )}
              </button>

              {submitStatus === "success" && (
                <div className="p-4 bg-green-50 text-green-800 rounded-lg">
                  Mensagem enviada com sucesso! Entraremos em contato em breve.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-4 bg-red-50 text-red-800 rounded-lg">
                  Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.
                </div>
              )}
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6">Informações de contato</h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-tivi-primary mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">E-mail</h3>
                  <p className="text-gray-600">contato@tiviai.com.br</p>
                  <p className="text-gray-600">suporte@tiviai.com.br</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-6 w-6 text-tivi-primary mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Telefone</h3>
                  <p className="text-gray-600">(11) 4002-8922</p>
                  <p className="text-gray-600">Segunda a Sexta, 9h às 18h</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-tivi-primary mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Endereço</h3>
                  <p className="text-gray-600">Av. Paulista, 1000 - Bela Vista</p>
                  <p className="text-gray-600">São Paulo - SP, 01310-100</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
