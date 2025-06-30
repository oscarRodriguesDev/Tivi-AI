import { useEffect, useState } from 'react';
import { marked } from 'marked';
import jsPDF from 'jspdf';
import { showInfoMessage } from '../../../../util/messages';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  transcription: string;
};

export default function TranscriptionModal({ isOpen, onClose, transcription }: ModalProps) {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    if (transcription) {
      const cleanMarkdown = transcription.replace(/\\n/g, '\n');
      const html: string | any = marked(cleanMarkdown);
      setHtmlContent(html);
    } else {
      // Se não houver transcrição, renderiza um placeholder.
      setHtmlContent('<p><em>Nenhuma transcrição encontrada.</em></p>');
    }
  }, [transcription]);

  /*    function handleSavePDF(): void {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
  
      const marginLeft = 10;
      const marginTop = 10;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const lineHeight = 7; // Espaçamento entre linhas
      const maxWidth = pageWidth - marginLeft * 2;
  
      let yPos = marginTop;
  
      const wrapText = (text: string): string[] => {
        return doc.splitTextToSize(text, maxWidth);
      };
  
      const addTextToPDF = (text: string): void => {
        const lines = wrapText(text);
        lines.forEach((line) => {
          if (yPos + lineHeight > pageHeight - marginTop) {
            doc.addPage();
            yPos = marginTop;
          }
          doc.text(line, marginLeft, yPos);
          yPos += lineHeight;
        });
      };
  
      addTextToPDF(transcription);
      yPos += lineHeight * 2;
  
      addTextToPDF("Análise detalhada da conversa:\n");
      yPos += lineHeight;
  
      addTextToPDF(transcription);
  
      doc.save("transcricao.pdf");
  
    }  */

  /*     function handleSavePDF(): void {
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });
      
        const marginLeft = 10;
        const marginTop = 10;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const lineHeight = 7;
        const maxWidth = pageWidth - marginLeft * 2;
        let yPos = marginTop;
      
        // Aplica fonte monoespaçada (opcional)
        doc.setFont("courier", "normal");
        doc.setFontSize(12);
      
        const wrapText = (text: string): string[] => {
          return doc.splitTextToSize(text, maxWidth);
        };
      
        const addTextToPDF = (text: string): void => {
          const paragraphs = text.split("\n\n"); // trata parágrafos separados
          paragraphs.forEach((paragraph) => {
            const lines = wrapText(paragraph);
            lines.forEach((line) => {
              if (yPos + lineHeight > pageHeight - marginTop) {
                doc.addPage();
                yPos = marginTop;
              }
              doc.text(line, marginLeft, yPos);
              yPos += lineHeight;
            });
            yPos += lineHeight; // Espaço extra entre parágrafos
          });
        };
      
        const addSectionTitle = (title: string): void => {
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          addTextToPDF(title);
          yPos += lineHeight;
          doc.setFontSize(12);
          doc.setFont("courier", "normal");
        };
      
        const addSeparator = (): void => {
          if (yPos + 5 > pageHeight - marginTop) {
            doc.addPage();
            yPos = marginTop;
          }
          doc.line(marginLeft, yPos, pageWidth - marginLeft, yPos);
          yPos += lineHeight;
        };
      
        // Conteúdo
        addSectionTitle("Transcrição da Sessão:");
        addTextToPDF(transcription);
        addSeparator();
      
        addSectionTitle("Análise detalhada da conversa:");
        addTextToPDF(transcription); // Supondo que você tenha uma variável 'analysis'
      
        doc.save("transcricao.pdf");
      }
      
   */



  function handleSavePDF(): void {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const marginLeft = 10;
    const marginTop = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const lineHeight = 7;
    const maxWidth = pageWidth - marginLeft * 2;
    let yPos = marginTop;

    const wrapText = (text: string): string[] => {
      return doc.splitTextToSize(text, maxWidth);
    };

    const safeAddPage = () => {
      if (yPos + lineHeight > pageHeight - marginTop) {
        doc.addPage();
        yPos = marginTop;
      }
    };

    const renderMarkdownLine = (line: string) => {
      safeAddPage();

      // Subtítulos numerados (ex: "1. Seção", "2. Outra seção")
      if (line.match(/^\d+\.\s+/)) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        const subtitle = line.replace(/^\d+\.\s+/, match => match); // mantém o "1. " visível
        const wrapped = wrapText(subtitle);
        wrapped.forEach(wrapLine => {
          doc.text(wrapLine, marginLeft, yPos);
          yPos += lineHeight;
        });
        return;
      }

      // Títulos
      if (line.startsWith("### ")) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(line.replace("### ", ""), marginLeft, yPos);
      } else if (line.startsWith("## ")) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(line.replace("## ", ""), marginLeft, yPos);
        doc.text(line.replace("** ", ""), marginLeft, yPos);
      } else if (line.startsWith("# ")) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(line.replace("# ", ""), marginLeft, yPos);
      }

      // Listas
      else if (line.match(/^[-*] /)) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        const wrapped = wrapText("• " + line.slice(2));
        wrapped.forEach(wrapLine => {
          doc.text(wrapLine, marginLeft, yPos);
          yPos += lineHeight;
        });
        return;
      }

      // Texto normal com negrito ou itálico simples
      else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        let formattedLine = line
          .replace(/\*\*(.*?)\*\*/g, "$1".toUpperCase()) // simula negrito com maiúsculas
          .replace(/\*(.*?)\*/g, "_$1_"); // simula itálico com underscores

        const wrapped = wrapText(formattedLine);
        wrapped.forEach(wrapLine => {
          doc.text(wrapLine, marginLeft, yPos);
          yPos += lineHeight;
        });
        return;
      }

      yPos += lineHeight;
    };


    const renderMarkdownText = (markdown: string) => {
      const lines = markdown.split("\n");

      lines.forEach((line, index) => {
        const isLastLine = index === lines.length - 1;

        if (line.trim() === "") {
          // Só pula linha se a próxima não for outra linha em branco
          const nextLine = lines[index + 1];
          if (nextLine && nextLine.trim() !== "") {
            yPos += lineHeight / 1.5; // espaçamento menor para quebras
          }
        } else {
          renderMarkdownLine(line);
        }

        if (isLastLine) {
          yPos += lineHeight;
        }
      });
    };

    // PDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Transcrição da Sessão", marginLeft, yPos);
    yPos += lineHeight * 1.5;

    renderMarkdownText(transcription);

    // Linha horizontal de separação (se couber)
    if (yPos + lineHeight < pageHeight - marginTop) {
      doc.line(marginLeft, yPos, pageWidth - marginLeft, yPos);
      yPos += lineHeight;
    }

    doc.save("DPT.pdf");

  }

  function handleSavePDF2(): void {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
  
    const marginLeft = 10;
    const marginTop = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const lineHeight = 7;
    const maxWidth = pageWidth - marginLeft * 2;
    let yPos = marginTop;
  
    const wrapText = (text: string): string[] => {
      return doc.splitTextToSize(text, maxWidth);
    };
  
    const safeAddPage = () => {
      if (yPos + lineHeight > pageHeight - marginTop) {
        doc.addPage();
        yPos = marginTop;
      }
    };
  
    const cleanFormatting = (text: string): string => {
      return text
        .replace(/^#+\s*/, "") // remove ##, ### etc. no início da linha
        .replace(/\*\*(.*?)\*\*/g, "$1") // remove **negrito**
        .replace(/\*(.*?)\*/g, "$1")     // remove *itálico*
        .trim();
    };
  
    const renderMarkdownLine = (line: string) => {
      safeAddPage();
  
      // Subtítulos numerados (ex: "1. Seção", "2. Outra seção")
      if (/^\d+\.\s+/.test(line)) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        const subtitle = cleanFormatting(line);
        const wrapped = wrapText(subtitle);
        wrapped.forEach(wrapLine => {
          doc.text(wrapLine, marginLeft, yPos);
          yPos += lineHeight;
        });
        return;
      }
  
      // Títulos
      if (line.startsWith("### ")) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(cleanFormatting(line), marginLeft, yPos);
      } else if (line.startsWith("## ")) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(cleanFormatting(line), marginLeft, yPos);
      } else if (line.startsWith("# ")) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(cleanFormatting(line), marginLeft, yPos);
      }
  
      // Listas
      else if (/^[-*] /.test(line)) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        const listItem = "• " + cleanFormatting(line.slice(2));
        const wrapped = wrapText(listItem);
        wrapped.forEach(wrapLine => {
          doc.text(wrapLine, marginLeft, yPos);
          yPos += lineHeight;
        });
        return;
      }
  
      // Texto comum
      else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        const plainText = cleanFormatting(line);
        const wrapped = wrapText(plainText);
        wrapped.forEach(wrapLine => {
          doc.text(wrapLine, marginLeft, yPos);
          yPos += lineHeight;
        });
        return;
      }
  
      yPos += lineHeight;
    };
  
    const renderMarkdownText = (markdown: string) => {
      const lines = markdown.split("\n");
  
      lines.forEach((line, index) => {
        const isLastLine = index === lines.length - 1;
  
        if (line.trim() === "") {
          const nextLine = lines[index + 1];
          if (nextLine && nextLine.trim() !== "") {
            yPos += lineHeight / 1.5;
          }
        } else {
          renderMarkdownLine(line);
        }
  
        if (isLastLine) {
          yPos += lineHeight;
        }
      });
    };
  
    // Cabeçalho do PDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Transcrição da Sessão", marginLeft, yPos);
    yPos += lineHeight * 1.5;
  
    renderMarkdownText(transcription);
  
    // Linha de separação
    if (yPos + lineHeight < pageHeight - marginTop) {
      doc.line(marginLeft, yPos, pageWidth - marginLeft, yPos);
      yPos += lineHeight;
    }
  
    doc.save("DPT.pdf");
  }
  



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full relative">
        {/* Botão de fechar */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Conteúdo da transcrição */}
        <div
          id="transcription-content"
          className="prose max-h-[70vh] overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Botões de ação */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={handleSavePDF2}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Baixar PDF
          </button>
          <button
            onClick={() => showInfoMessage("Função de arquivamento futura.")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Arquivar
          </button>
        </div>
      </div>
    </div>
  );
}
