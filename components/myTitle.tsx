/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth";
import { fetchUserTitles, deleteTitle, editarTitle } from "@/lib/linkActions";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import Subcredenciais from "@/app/componentesDashboard/subCredenciais/page";

type TitleType = {
  id: number;
  title?: string;
  subtitulo?: string;
  imageUrl?: string;
};

export default function MyTitle() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [titles, setTitles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false);
  const [isEditingURL, setIsEditingURL] = useState(false);
  const [currentTitle, setCurrentTitle] = useState<any>(null);
  const [, setMessage] = useState<string | null>(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const session = await getSession();
        if (session && session.id) {
          const userId = Number(session.id);
          const fetchedTitles = await fetchUserTitles(userId);
          setTitles(fetchedTitles);
        } else {
          setError("User not authenticated.");
        }
      } catch (err) {
        setError("Erro ao buscar títulos do usuário.");
        console.error("Erro ao buscar títulos:", err);
      }
      setLoading(false);
    };

    fetchTitles();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleDelete = async (titleId: number) => {
    try {
      await deleteTitle(titleId);
      setTitles(titles.filter((title) => title.id !== titleId));
    } catch (error) {
      console.error("Erro ao deletar o título:", error);
      setError("Erro ao deletar o título.");
    }
  };

  const handleEditTitleClick = (title: any) => {
    setCurrentTitle(title);
    setIsEditingTitle(true);
  };

  const handleEditSubtitleClick = (title: any) => {
    setCurrentTitle(title);
    setIsEditingSubtitle(true);
  };

  const handleEditURLClick = (title: any) => {
    setCurrentTitle(title);
    setIsEditingURL(true);
  };

  const handleEditTitle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await editarTitle(currentTitle.id, { title: currentTitle.title });
      setMessage("Título editado com sucesso!");
      setTitles((prevtitles) =>
        prevtitles.map((title) =>
          title.id === currentTitle.id
            ? { ...title, title: currentTitle.title }
            : title
        )
      );
      setIsEditingTitle(false);
    } catch (error) {
      console.error("Erro ao editar o título:", error);
      setError("Erro ao editar o título.");
      setMessage(null);
    }
  };

  const handleEditSubtitle = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      await editarTitle(currentTitle.id, { subtitulo: currentTitle.subtitulo });
      setMessage("Subtítulo editado com sucesso!");
      setTitles((prevtitles) =>
        prevtitles.map((title) =>
          title.id === currentTitle.id
            ? { ...title, subtitulo: currentTitle.subtitulo }
            : title
        )
      );
      setIsEditingSubtitle(false);
    } catch (error) {
      console.error("Erro ao editar o subtítulo:", error);
      setError("Erro ao editar o subtítulo.");
      setMessage(null);
    }
  };

  const handleEditURL = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await editarTitle(currentTitle.id, {
        imageUrl: currentTitle.imageUrl,
      } as Partial<TitleType>);

      setMessage("URL editada com sucesso!");
      setTitles((prevtitles) =>
        prevtitles.map((title) =>
          title.id === currentTitle.id
            ? { ...title, imageUrl: currentTitle.imageUrl }
            : title
        )
      );
      setIsEditingURL(false);
    } catch (error) {
      console.error("Erro ao editar o URL:", error);
      setError("Erro ao editar o URL.");
      setMessage(null);
    }
  };

  return (
    <>
      <div
        className={`${
          isExpanded
            ? "w-full fixed inset-0 h-screen bg-white z-10"
            : "w-full  border shadow-lg border-slate-200 rounded-lg hidden"
        } cursor-pointer transition-all duration-500 ease-in-out bg-white sm:mt-0 mt-10`}
      >
        <div
          className={`${
            isExpanded ? "h-screen w-screen p-4 sm:pl-44 sm:pr-44 sm:pt-16" : ""
          }`}
        >
          <button
            onClick={toggleExpand}
            className=" text-black p-1.5 rounded-md lg:text-lg xl:text-xl 2xl:text-2xl underline"
          >
            {isExpanded ? "Voltar" : "Abrir"}
          </button>
          <Subcredenciais></Subcredenciais>
        </div>
      </div>

      {isEditingTitle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Editar Títul</h2>
            <form onSubmit={handleEditTitle}>
              <label className="block mb-2">
                Título:
                <input
                  type="text"
                  value={currentTitle.title}
                  onChange={(e) =>
                    setCurrentTitle({
                      ...currentTitle,
                      title: e.target.value,
                    })
                  }
                  className="border p-2 w-full"
                />
              </label>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Salvar
              </button>
              <button
                onClick={() => setIsEditingTitle(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded ml-2"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {isEditingSubtitle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Editar Subtítulo</h2>
            <form onSubmit={handleEditSubtitle}>
              <label className="block mb-2">
                Subtítulo:
                <input
                  type="text"
                  value={currentTitle.subtitulo}
                  onChange={(e) =>
                    setCurrentTitle({
                      ...currentTitle,
                      subtitulo: e.target.value,
                    })
                  }
                  className="border p-2 w-full"
                />
              </label>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Salvar
              </button>
              <button
                onClick={() => setIsEditingSubtitle(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded ml-2"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {isEditingURL && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Editar Título</h2>
            <form onSubmit={handleEditURL}>
              <label className="block mb-2">
                URL de imagem:
                <input
                  type="text"
                  value={currentTitle.imageUrl}
                  onChange={(e) =>
                    setCurrentTitle({
                      ...currentTitle,
                      imageUrl: e.target.value,
                    })
                  }
                  className="border p-2 w-full"
                />
              </label>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Salvar
              </button>
              <button
                onClick={() => setIsEditingURL(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded ml-2"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center mt-6 m-4">
        <h1 className="text-lg lg:text-xl xl:text-2xl font-bold mb-6">
          Meus Títulos
        </h1>
        <ul className="space-y-4 w-full max-w-2xl">
          {titles.map((title) => (
            <li key={title.id}>
              <div className="flex items-center p-4 border rounded-lg shadow">
                <h1>{title.title}</h1>
                <div className="flex-grow"></div>
                <button
                  onClick={() => handleEditTitleClick(title)}
                  className="ml-4 text-yellow-500 hover:underline"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(title.id)}
                  className="ml-4 text-red-500 hover:underline"
                >
                  <FaRegTrashAlt />
                </button>
              </div>
              <div className="flex items-center p-4 border rounded-lg shadow mt-4">
                <h1>{title.subtitulo}</h1>
                <div className="flex-grow"></div>
                <button
                  onClick={() => handleEditSubtitleClick(title)}
                  className="ml-4 text-yellow-500 hover:underline"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(title.id)}
                  className="ml-4 text-red-500 hover:underline"
                >
                  <FaRegTrashAlt />
                </button>
              </div>
              <div className="flex items-center p-4 border rounded-lg shadow ">
                <h1 className="break-all">{title.imageUrl}</h1>
                <div className="flex-grow"></div>
                <button
                  onClick={() => handleEditURLClick(title)}
                  className="ml-4 text-yellow-500 hover:underline"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(title.id)}
                  className="ml-4 text-red-500 hover:underline"
                >
                  <FaRegTrashAlt />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-center m-4">
        <button
          onClick={toggleExpand}
          className=" text-white  bg-blue-500 hover:bg-blue-600 w-full max-w-2xl p-2 rounded-lg lg:text-lg xl:text-xl 2xl:text-2xl  font-bold"
        >
          Adicionar títulos
        </button>
      </div>
    </>
  );
}
