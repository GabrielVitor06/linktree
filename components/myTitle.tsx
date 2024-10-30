/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import SubCredenciais from "@/app/componentesDashboard/credenciaisSubtitulo/page";
import { useEffect, useState } from "react";
import { getSession } from "@/lib/actions"; // Função para obter a sessão do usuário
import { fetchUserTitles, deleteTitle, editarTitle } from "@/lib/linkActions"; // Função para buscar os titles do usuário
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";

export default function MyTitle() {
  // Estado para controlar se o div está expandido ou não
  // Estado para controlar se o div está expandido ou não
  const [isExpanded, setIsExpanded] = useState(false);
  const [titles, setTitles] = useState<any[]>([]); // Substitua 'any' pelo tipo adequado
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState<any>(null); // Armazena o link que será editado
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [, setMessage] = useState<string | null>(null);

  // Função para alternar o estado
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const fetchTitles = async () => {
      const session = await getSession();

      if (session && session.id) {
        const userId = Number(session.id);
        const fetchedTitles = await fetchUserTitles(userId);
        setTitles(fetchedTitles);
      } else {
        setError("User not authenticated.");
      }
      setLoading(false);
    };

    fetchTitles();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Função para deletar um link
  const handleDelete = async (titleId: number) => {
    try {
      await deleteTitle(titleId); // Chama a função deletetitle passando o ID do title
      // Atualiza a lista de titles após a exclusão
      setTitles(titles.filter((title) => title.id !== titleId));
    } catch (error) {
      console.error("Erro ao deletar o title:", error);
      setError("Erro ao deletar o title.");
    }
  };

  const handleEditClick = (link: any) => {
    setCurrentTitle(link);
    setSelectedPlatforms(link.platforms ? link.platforms.split(",") : []);
    setIsEditing(true);
  };

  // Função para atualizar um link

  const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    selectedPlatforms.forEach((platform) => {
      formData.append("platforms", platform);
    });

    try {
      await editarTitle(currentTitle.id, {
        title: currentTitle.url,
        subtitulo: currentTitle.text,
      });

      // Se a edição foi bem-sucedida, atualize o estado
      setMessage("Link editado com sucesso!");
      setError(null);
      setTitles((prevtitles) =>
        prevtitles.map((link) =>
          link.id === currentTitle.id
            ? { ...currentTitle, platforms: selectedPlatforms.join(",") }
            : link
        )
      );
      setIsEditing(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro desconhecido");
      setMessage(null);
    }
  };
  return (
    <>
      <div className="flex justify-center mt-12 m-4">
        <button
          onClick={toggleExpand}
          className=" text-black border-zinc-100 shadow-lg border w-full max-w-2xl p-2 rounded-lg lg:text-lg xl:text-xl 2xl:text-2xl  font-bold"
        >
          TÍTULOS
        </button>
      </div>
      <div
        className={`${
          isExpanded
            ? "w-full fixed inset-0 h-screen bg-white z-10"
            : "w-full  border shadow-lg border-slate-200 rounded-lg hidden"
        } cursor-pointer transition-all duration-500 ease-in-out bg-white sm:mt-0 `}
      >
        <div
          className={`${
            isExpanded ? "h-screen w-screen p-4 sm:pl-44 sm:pr-44 sm:pt-32" : ""
          }`}
        >
          <button
            onClick={toggleExpand}
            className=" text-black p-1.5 rounded-md lg:text-lg xl:text-xl 2xl:text-2xl underline"
          >
            {isExpanded ? "Voltar" : "Abrir"}
          </button>
          <SubCredenciais></SubCredenciais>
        </div>
      </div>

      {/* Interface para Edição */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Editar Link</h2>
            {/* {message && <p className="text-green-500">{message}</p>}
            {error && <p className="text-red-500">{error}</p>} */}
            <form onSubmit={handleEdit}>
              <label className="block mb-2">
                URL:
                <input
                  type="text"
                  value={currentTitle.url}
                  onChange={(e) =>
                    setCurrentTitle({ ...currentTitle, title: e.target.value })
                  }
                  className="border p-2 w-full"
                />
              </label>
              <label className="block mb-2">
                Título:
                <input
                  type="text"
                  value={currentTitle.text}
                  onChange={(e) =>
                    setCurrentTitle({
                      ...currentTitle,
                      subtitulo: e.target.value,
                    })
                  }
                  className="border p-2 w-full"
                />
              </label>
              <h1 className="block text-gray-700 font-medium mb-2">
                Escolha a Plataforma:
              </h1>

              <div className="flex items-center justify-center mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded "
                >
                  Salvar
                </button>
                <div className="flex-grow"></div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded ml-2"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center mt-10 m-4">
        <h1 className="text-lg lg:text-xl xl:text-2xl font-bold mb-6">
          Meus Títulos
        </h1>
        <ul className="space-y-4 w-full max-w-2xl">
          {titles.map((title) => (
            <li key={title.id}>
              <div className="flex items-center p-4 border rounded-lg shadow">
                {/* Ajuste se platforms não for uma string única */}
                <h1>{title.title}</h1>
                <div className="flex-grow"></div>
                <button
                  onClick={() => handleEditClick(title)} // Chama a função de deletar ao clicar
                  className="ml-4 text-yellow-500 hover:underline"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(title.id)} // Chama a função de deletar ao clicar
                  className="ml-4 text-red-500 hover:underline"
                >
                  <FaRegTrashAlt />
                </button>
              </div>
              <div className="flex items-center p-4 border rounded-lg shadow mt-4">
                {/* Ajuste se platforms não for uma string única */}
                <h1>{title.subtitulo}</h1>
                <div className="flex-grow"></div>
                <button
                  onClick={() => handleEditClick(title)} // Chama a função de deletar ao clicar
                  className="ml-4 text-yellow-500 hover:underline"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(title.id)} // Chama a função de deletar ao clicar
                  className="ml-4 text-red-500 hover:underline"
                >
                  <FaRegTrashAlt />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
