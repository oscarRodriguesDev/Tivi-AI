'use client'
import { useAccessControl } from "@/app/context/AcessControl";
import { FaHeart, FaUserMd } from "react-icons/fa";
import HeadPage from "../components/headPage";

const postsFake = [
  {
    id: 1,
    autor: "Dra. Fernanda Lima",
    descricao: "Hoje utilizei uma nova abordagem para tratar ansiedade infantil. Os resultados foram surpreendentes!",
    imagem: "https://via.placeholder.com/600x300.png?text=Foto+da+Sessao",
    votos: 12,
  },
  {
    id: 2,
    autor: "Dr. Rafael Martins",
    descricao: "Compartilho um artigo interessante que relaciona TCC com neuroplasticidade.",
    imagem: "",
    votos: 7,
  },
];

const PaginaInicial = () => {
  const { role } = useAccessControl();

  return (
    <>
      <HeadPage title="Rede de Psicólogos" icon={<FaUserMd size={20} />} />

      {role !== "PSYCHOLOGIST" ? (
        <div className="px-4 py-6 space-y-6">
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Nova Publicação</h2>
            <textarea
              placeholder="Compartilhe sua experiência, uma imagem ou reflexão..."
              className="w-full p-3 border border-gray-300 rounded-xl resize-none mb-2"
              rows={3}
            />
            <div className="flex justify-end">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
                Publicar
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {postsFake.map((post) => (
              <div key={post.id} className="bg-white p-4 rounded-2xl shadow">
                <div className="font-semibold text-gray-800 mb-2">{post.autor}</div>
                <p className="text-gray-700 mb-2">{post.descricao}</p>
                {post.imagem && (
                  <img
                    src={post.imagem}
                    alt="Imagem do post"
                    className="rounded-xl mb-2"
                  />
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaHeart className="text-red-500" />
                  {post.votos} votos
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen text-gray-600">
          Essa página é acessível apenas para psicólogos.
        </div>
      )}
    </>
  );
};

export default PaginaInicial;
