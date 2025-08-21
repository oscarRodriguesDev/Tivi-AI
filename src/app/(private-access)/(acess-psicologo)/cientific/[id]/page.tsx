"use client";

import { useAccessControl } from "@/app/context/AcessControl";
import { GiMaterialsScience } from "react-icons/gi";
import HeadPage from "@/app/(private-access)/components/headPage";
import { FaRobot } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { HiDocumentCheck } from "react-icons/hi2";
import Image from "next/image";
import { example1, example2, example3 } from "@/app/util/books";


import livro1 from '../../../../../assets/books/book1.jpeg';
import livro2 from '../../../../../assets/books/book2.jpg';
import livro3 from '../../../../../assets/books/book3.jpg';



import mammoth from "mammoth";
import { showErrorMessage, showPersistentLoadingMessage, showSuccessMessage, updateToastMessage } from "@/app/util/messages";

interface Docs {
  id: string;
  name: string;
  psicologoId: string;
  prompt: string;
}


interface Livro {
  id: string;
  name: string;
  psicologoId?: string; // Tornar opcional se não existir sempre
  autor?: string;
  url_capa?: string
  resumo: string;
}

const livromock = [
  {
    id: "1a2b3c",
    name: "O mal estar da Civilização",
    url_capa: livro1,
    resumo: example1
  },
  {
    id: "4d5e6f",
    name: "Inteligencia Emocional",
    url_capa: livro2,
    resumo: example2
  },
  {
    id: "7g8h9i",
    name: "Procrastinação nunca mais",
    url_capa: livro3,
    resumo: example3
  }
];

const BaseCientifica = () => {
  const { id } = useParams();
  const { role } = useAccessControl();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [docName, setDocName] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [savingPrompt, setSavingPrompt] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [fileCapa, setFileCapa] = useState<File | null>(null);
  const [capaPreview, setCapaPreview] = useState<string | null>(null);
  const [resumo, setResumo] = useState("Nenhum resumo criado");
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [docs, setDocs] = useState<Docs[]>([]);
  
  


  //salva o arquivo de texto no banco de dados
  const handleFileChange = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    let text = "";
    try {
      if (ext === "pdf") {
        alert("⚠️ Aviso: pdf-lib não extrai texto nativamente. Prefira arquivos .txt ou .docx para melhor resultado.");
      } else if (ext === "txt") {
        text = await file.text();
      } else if (ext === "docx") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else {
        alert("Formato não suportado, TXT ou DOCX.");
        return;
      }
      setCustomPrompt(text);
    } catch (err) {
      console.error("Erro ao ler arquivo:", err);
      alert("Erro ao ler o conteúdo do arquivo.");
    }
  };

  //faz o envio da capa do livro para o storage
  const enviarCapa = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/internal/uploads/capa?path=capa-livro", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        console.error("Erro ao fazer upload:", await response.text());
        return null;
      }
      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error("Erro na requisição:", error);
      return null;
    }
  };


  //gera o resumo do livro
  const getResume = async (titulo: string, autor: string): Promise<string> => {
    const toastId = showPersistentLoadingMessage('Gerando resumo do livro...');
    try {
      const response = await fetch("/api/internal/insight/generateResume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo,
          autor,
        }),
      });

      if (!response.ok) {
        updateToastMessage(toastId, 'Erro ao gerar relatório.', 'error');
        throw new Error("Erro ao gerar resumo");
      }

      if (response.ok) {
        updateToastMessage(toastId, 'Relatório gerado com sucesso!', 'success');
         reloadLivros()
      }

      const data = await response.json();
      alert(data.result);

      // Garante que `data.result` seja string
      if (typeof data.result === "string") {
        return data.result;
      } else {
        return "";
      }
    } catch (error) {
      console.error("Erro ao gerar resumo:", error);
      return ''
    }
  };



   //salva o livro no banco de dados
  const handleSaveBook = async (resume: string) => {
    if (!fileCapa || !titulo || !autor) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    const capaUrl = await enviarCapa(fileCapa);
    if (!capaUrl) {
      showErrorMessage("Falha no upload da capa.");
      return;
    }

    try {
      const response = await fetch("/api/internal/upbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          autor,
          psicologoId: id,
          name: titulo,
          url_capa: capaUrl,
          resumo: resumo
        }),
      });

      if (!response.ok) throw new Error();
      showSuccessMessage("Livro salvo com sucesso!");
      //buscar de novo
       await reloadLivros()
       limpaLivro()
      
    } catch (error) {
      showErrorMessage("Erro ao salvar livro na base de dados");
    }
  };


  //deleta o livro
  const handleDeleteBook = async (bookId: string) => {
    if (!confirm("Tem certeza que deseja deletar este livro?")) return;

    try {
      const response = await fetch(`/api/internal/upbook?bookId=${bookId}`, {
        method: "DELETE",
      });
      await reloadLivros()
      limpaLivro()

      if (!response.ok) throw new Error();
      setDocs(prev => prev.filter(doc => doc.id !== bookId));
    } catch (err) {
      alert("Erro ao deletar livro.");
    }
  };


  //salva os modelos de documentos no banco
  const handleSavedocModel = async () => {
    if (!docName.trim() || !customPrompt.trim() || !id) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    setSavingPrompt(true);
    try {
      const response = await fetch("/api/internal/uploads/doc-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: docName.trim(),
          psicologoId: id,
          prompt: customPrompt.trim()
        })
      });

      if (!response.ok) throw new Error();
      alert("Documento salvo com sucesso!");
      setDocName("");
      setCustomPrompt("");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar documento.");
    } finally {
      setSavingPrompt(false);
    }
  };


  //faz uma busca no banco pelos modelos de documentos do psicologo
  const docSeek = async (): Promise<Docs[]> => {
    if (!id) {
      alert("ID do psicólogo não encontrado.");
      return [];
    }

    try {
      const response = await fetch(`/api/internal/uploads/doc-model?psicologoId=${id}`);
      if (!response.ok) throw new Error();
      return await response.json();
    } catch (err) {
      console.error("Erro ao buscar documentos:", err);
      return [];
    }
  };

  //recupera os  modelos de docuemtno do banco de dados
  useEffect(() => {
    docSeek().then(setDocs);
  }, []);


  //deleta o modelo de documetno
  const handleDelete = async (docId: string) => {
    if (!confirm("Tem certeza que deseja deletar este documento?")) return;

    try {
      const response = await fetch(`/api/internal/uploads/doc-model?docId=${docId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();
      setDocs(prev => prev.filter(doc => doc.id !== docId));
    } catch (err) {
      alert("Erro ao deletar documento.");
    }
  };



//gera o resumo do livro
  const geraResumo = async (titulo: string, autor: string) => {
    setResumo(await getResume(titulo, autor));
  }



//buscar livros novamente:
const reloadLivros = async () => {
  if (!id) return;
  setLoading(true);
  setError(null);
  try {
    const response = await fetch(`/api/internal/upbook/?psicologoId=${id}`);
    if (!response.ok) throw new Error(`Erro: ${response.status}`);
    const data: Livro[] = await response.json();
    setLivros(data);
  } catch (err: any) {
    setError(err.message || "Erro ao carregar livros");
  } finally {
    setLoading(false);
  }
  limpaLivro
};


//limpar campos livro
const limpaLivro = () => {
 setCapaPreview(null);
 setTitulo("");
 setAutor("");

}



  //recuperar livros:
  useEffect(() => {
    if (!id) return;
    const fetchLivros = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/internal/upbook/?psicologoId=${id}`);
        if (!response.ok) {
          throw new Error(`Erro: ${response.status}`);
        }
        const data: Livro[] = await response.json();
        setLivros(data);
        console.log('livros', data);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar livros");
      } finally {
        setLoading(false);
      }
    };

    fetchLivros();
  }, [id]);


  //corrige a url do livro
  const getFullUrl = (url?: string) => {
    if (!url) return "/placeholder.png";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    // Caso contrário, adiciona https://
    return `https://${url}`;
  };


  return (
    <>
      <HeadPage title="Base Científica" icon={<GiMaterialsScience size={20} />} />
      {role !== "PSYCHOLOGIST" ? (
        <div className="flex justify-center items-center h-screen text-red-500 text-lg">
          Essa página é acessível apenas para psicólogos
        </div>
      ) : (

     
       <>
        <div className="p-6 space-y-6">
          <div className="bg-blue-100 p-4 rounded-xl flex items-center gap-4">
            <FaRobot className="text-blue-500 text-3xl" />
            <div>
              <p className="font-semibold text-blue-800">GPT está utilizando esses materiais para gerar insights.</p>
              <p className="text-sm text-blue-700">Você pode adicionar novos arquivos para enriquecer a base.</p>
            </div>
          </div>


          <h3>Livros e artigos adicionados</h3>
          <div className="w-full border border-cyan-950 p-4 flex flex-wrap gap-6 justify-start">
            {livros.length > 0 ? (
              livros.map((livro) => (
                <div
                  key={livro.id}
                  className="flex flex-col items-center w-36 bg-white rounded-md shadow-sm p-3 text-center hover:shadow-md transition-shadow duration-300"
                >
                  <Image
                    src={getFullUrl(livro.url_capa)}
                    alt={livro.name}
                    width={120}
                    height={180}
                    className="object-cover rounded-md shadow-sm border border-gray-200 bg-white"
                    unoptimized
                  />

                  <span className="mt-3 text-sm font-semibold text-gray-900 truncate" title={livro.name}>
                    {livro.name}
                  </span>
                  <span
                    onClick={() => handleDeleteBook(livro.id)}
                    className="ml-auto text-red-600 text-sm cursor-pointer font-semibold px-2 py-1 rounded hover:bg-red-100 transition duration-200"
                    title="Deletar livro"
                  >
                    ×
                  </span>
                </div>
              ))
            ) : (
              livromock.map((livro) => (
                <div
                  key={livro.id}
                  className="flex flex-col items-center w-36 bg-white rounded-md shadow-sm p-3 text-center hover:shadow-md transition-shadow duration-300"
                >
                  <Image
                    src={livro.url_capa}
                    alt={livro.name}
                    width={40}
                    height={120}
                    className="object-contain rounded"
                    unoptimized

                    title={livro.resumo}
                  />

                  <span className="mt-3 text-[10px] font-semibold text-gray-900 truncate" >
                    {livro.name}
                  </span>


                </div>
              ))

            )}

          </div>


          <div className="bg-white rounded-xl shadow p-4 space-y-3">
            <h3 className="text-lg font-semibold text-gray-700">Adicionar novo Livro ou Artigo</h3>
            <input type="text" placeholder="Titulo" className="border p-2 rounded w-full" value={titulo} onChange={e => setTitulo(e.target.value)} />
            <input type="text" placeholder="Autor" className="border p-2 rounded w-full" value={autor} onChange={e => setAutor(e.target.value)} />
            <input type="file" accept=".jpg,.png,.jpeg" className="border p-2 rounded w-full" onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                setFileCapa(file);
                setCapaPreview(URL.createObjectURL(file));
              }
            }} />
            {capaPreview && <img src={capaPreview} alt="Preview da capa" className="w-32 h-auto rounded border" />}
            <div className=" flex flex-row justify-between w-[25%]">


            <button
              onClick={() => geraResumo(titulo, autor)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              gerar resumo

            </button>
            <button
              onClick={() => handleSaveBook(resumo)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Salvar Livro
            </button>
            </div>
          </div>


               {/* doc models adicionados */}
          <h3>Modelos de documentos adicionados</h3>
          <div className="w-full border border-cyan-950 p-4 flex flex-wrap gap-2">
            {docs.map((doc) => (
              <div key={doc.id} className="flex items-center gap-2 bg-cyan-100 text-cyan-800 text-sm font-medium px-3 py-2 rounded-lg shadow-sm transition hover:bg-cyan-200">
                <HiDocumentCheck size={18} />
                <span>{doc.name}</span>
                <span onClick={() => handleDelete(doc.id)} className="ml-2 cursor-pointer text-red-600 hover:text-white bg-red-100 hover:bg-red-600 rounded-full px-2 py-1 text-xs font-semibold transition">
                  x
                </span>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow p-4 space-y-3">
            <h3 className="text-lg font-semibold text-gray-700">Adicionar novo Modelo de Documento</h3>
            <input type="text" 
            value={docName} 
            onChange={e => setDocName(e.target.value)}
             placeholder="Nome do documento" 
             className="border p-2 rounded w-full" 
             />

            <input type="file"
             accept=".pdf,.txt,.docx"
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="border p-2 rounded w-full"
             />

          {/*   <textarea 
            value={customPrompt}
             onChange={e => setCustomPrompt(e.target.value)}
              placeholder="Conteúdo extraído do documento..."
               className="w-full border rounded p-3 min-h-[200px] text-sm text-gray-700"
                /> */}

            <button
             onClick={handleSavedocModel}
              disabled={savingPrompt} 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50">
              {savingPrompt ? "Salvando..." : "Salvar documento"}
            </button>
          </div>

        
        </div>
       
       </>
      
      )}
    </>
  );
};

export default BaseCientifica;