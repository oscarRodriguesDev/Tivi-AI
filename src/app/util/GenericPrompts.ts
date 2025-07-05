export function generate(mensagem: string, model: string): string {
  return `
### 📌 INSTRUÇÕES GERAIS PARA A GERAÇÃO DE DOCUMENTOS PSICOLÓGICOS

🔹 *Objetivo Geral:*  
O ChatGPT deve seguir *rigorosamente* o modelo de documento abaixo, respeitando sua estrutura, linguagem, campos e formatação, com base única e exclusivamente na transcrição da consulta fornecida.
Tente reconhecer os titulos, subtitulos, e paragrafos dando enfase diferenciada pros itens que precisam, com objetivo de formatar o texto 
de forma clara e objetiva
---

## 📍 1. MODELO A SER UTILIZADO

🧾 Modelo selecionado (extraído da base de conhecimento):

${model}

---

## 📍 2. FUNCIONAMENTO GERAL

Com base no modelo acima e na transcrição da sessão abaixo, gere o documento solicitado:

🗣️ **Transcrição da Sessão**  
"""  
${mensagem}  
"""

✅ Diretrizes:

- Siga a estrutura, linguagem e organização do modelo exatamente como está.
- Preencha cada campo com dados reais da transcrição.
- Não invente informações: se algo não estiver presente na sessão, escreva: **"Nada consta na consulta."**
- Utilize o DSM-5 ou CID-11 quando necessário para diagnósticos.
- Adicione um campo final de **"Observações Complementares"**, se aplicável.
- Finalize com uma nota ética e de responsabilidade profissional.

---

## 📍 3. TIPOS DE DOCUMENTOS SUPORTADOS (referência para entendimento)

- **RBT:** Relatório Base Terapêutico
- **TRT:** Transcrição Rica Terapêutica
- **DTP:** Devolutiva de Triagem Psicológica
- **AV:** Avaliação Psicológica
- **RN:** Resumo Neuropsicológico
- **Laudo:** Laudo Psicológico
- **Encaminhamento:** Encaminhamento Psicológico
- **Anamnese:** Anamnese Psicológica
- **Plano Terapêutico:** Estruturação do Plano Terapêutico

⚠ O modelo utilizado agora é: **${model.split('\n')[0].slice(0, 80)}...** (recortado para controle visual)

---

## 📍 4. LEMBRETES FINAIS

- 🔒 LGPD: Não inclua dados sensíveis não autorizados.
- 🎓 Validação Profissional: O conteúdo deve estar adequado ao código de ética do psicólogo.
- ✍️ Responda com o documento gerado pronto para ser utilizado, sem explicações adicionais.

`.trim();
}
