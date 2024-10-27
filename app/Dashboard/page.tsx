/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Credenciais from "@/app/createLinktree/credenciais/page";
import { useEffect, useState } from "react";
import { getSession } from "@/lib/actions"; // Função para obter a sessão do usuário
import { fetchUserLinks, deleteLink, editarLink } from "@/lib/linkActions"; // Função para buscar os links do usuário
import {
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaRegTrashAlt,
  FaEdit,
} from "react-icons/fa";
import Link from "next/link";

export default function Dashboard() {
  // Estado para controlar se o div está expandido ou não
  const [isExpanded, setIsExpanded] = useState(false);
  const [links, setLinks] = useState<any[]>([]); // Substitua 'any' pelo tipo adequado
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLink, setCurrentLink] = useState<any>(null); // Armazena o link que será editado
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [, setMessage] = useState<string | null>(null);

  // Função para alternar o estado
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const fetchLinks = async () => {
      const session = await getSession();

      if (session && session.id) {
        const userId = Number(session.id);
        const fetchedLinks = await fetchUserLinks(userId);
        setLinks(fetchedLinks);
      } else {
        setError("User not authenticated.");
      }
      setLoading(false);
    };

    fetchLinks();
  }, []);

  const getIcon = (platform: string) => {
    switch (platform) {
      case "Twitter":
        return <FaTwitter />;
      case "LinkedIn":
        return <FaLinkedin />;
      case "WhatsApp":
        return <FaWhatsapp />;
      case "Facebook":
        return <FaFacebook />;
      case "Instagram":
        return <FaInstagram />;
      default:
        return null;
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Função para deletar um link
  const handleDelete = async (linkId: number) => {
    try {
      await deleteLink(linkId); // Chama a função deleteLink passando o ID do link
      // Atualiza a lista de links após a exclusão
      setLinks(links.filter((link) => link.id !== linkId));
    } catch (error) {
      console.error("Erro ao deletar o link:", error);
      setError("Erro ao deletar o link.");
    }
  };

  const handleEditClick = (link: any) => {
    setCurrentLink(link);
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
      await editarLink(currentLink.id, {
        url: currentLink.url,
        text: currentLink.text,
        platforms: selectedPlatforms.join(","),
      });

      // Se a edição foi bem-sucedida, atualize o estado
      setMessage("Link editado com sucesso!");
      setError(null);
      setLinks((prevLinks) =>
        prevLinks.map((link) =>
          link.id === currentLink.id
            ? { ...currentLink, platforms: selectedPlatforms.join(",") }
            : link
        )
      );
      setIsEditing(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro desconhecido");
      setMessage(null);
    }
  };

  // const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   const formData = new FormData(event.currentTarget);
  //   selectedPlatforms.forEach((platform) => {
  //     formData.append("platforms", platform);
  //   });

  //   const result = await editarLink(currentLink.id, {
  //     url: currentLink.url,
  //     text: currentLink.text,
  //     platforms: selectedPlatforms.join(","),
  //   });

  //   if (result.ok) {
  //     setMessage("Link editado com sucesso!");
  //     setError(null);
  //     setLinks((prevLinks) =>
  //       prevLinks.map((link) =>
  //         link.id === currentLink.id
  //           ? { ...currentLink, platforms: selectedPlatforms.join(",") }
  //           : link
  //       )
  //     );
  //     setIsEditing(false);
  //   } else {
  //     setError(result.error || "Ocorreu um erro ao editar o link.");
  //     setMessage(null);
  //   }
  // };

  return (
    <>
      <div className="flex justify-center mt-20 m-4">
        <button
          onClick={toggleExpand}
          className=" text-black border-zinc-100 shadow-lg border w-full max-w-2xl p-2 rounded-lg lg:text-lg xl:text-xl 2xl:text-2xl  font-bold"
        >
          ADD LINK
        </button>
      </div>
      <div
        className={`${
          isExpanded
            ? "w-full fixed inset-0 h-screen bg-white z-10"
            : "w-full  border shadow-lg border-slate-200 p-8 rounded-lg mt-12 hidden"
        } cursor-pointer transition-all duration-500 ease-in-out bg-white sm:mt-0 `}
      >
        <div
          className={`${
            isExpanded
              ? "h-screen w-screen p-12 sm:pl-44 sm:pr-44 sm:pt-32"
              : ""
          }`}
        >
          <button
            onClick={toggleExpand}
            className=" text-black p-1.5 rounded-md lg:text-lg xl:text-xl 2xl:text-2xl underline"
          >
            {isExpanded ? "Voltar" : "Abrir"}
          </button>
          <Credenciais></Credenciais>
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
                  value={currentLink.url}
                  onChange={(e) =>
                    setCurrentLink({ ...currentLink, url: e.target.value })
                  }
                  className="border p-2 w-full"
                />
              </label>
              <label className="block mb-2">
                Texto:
                <input
                  type="text"
                  value={currentLink.text}
                  onChange={(e) =>
                    setCurrentLink({ ...currentLink, text: e.target.value })
                  }
                  className="border p-2 w-full"
                />
              </label>
              <h1 className="block text-gray-700 font-medium mb-2">
                Escolha a Plataforma:
              </h1>
              <div className="flex flex-col mt-4 space-y-2">
                {[
                  {
                    name: "Twitter",
                    icon: <FaTwitter className="text-blue-500" />,
                  },
                  {
                    name: "LinkedIn",
                    icon: <FaLinkedin className="text-blue-700" />,
                  },
                  {
                    name: "WhatsApp",
                    icon: <FaWhatsapp className="text-green-500" />,
                  },
                  {
                    name: "Facebook",
                    icon: <FaFacebook className="text-blue-600" />,
                  },
                  {
                    name: "Instagram",
                    icon: <FaInstagram className="text-pink-500" />,
                  },
                ].map((platform) => (
                  <label key={platform.name} className="flex items-center">
                    <input
                      type="checkbox"
                      value={platform.name}
                      checked={selectedPlatforms.includes(platform.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPlatforms((prev) => [
                            ...prev,
                            platform.name,
                          ]);
                        } else {
                          setSelectedPlatforms((prev) =>
                            prev.filter((p) => p !== platform.name)
                          );
                        }
                      }}
                      className="mr-2"
                    />
                    {platform.icon}
                    <span className="ml-2">{platform.name}</span>
                  </label>
                ))}
              </div>

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
        <h1 className="text-3xl font-bold mb-6">Meus Links</h1>
        <ul className="space-y-4 w-full max-w-2xl">
          {links.map((link) => (
            <li
              key={link.id}
              className="flex items-center p-4 border rounded-lg shadow "
            >
              {getIcon(link.platforms)}{" "}
              {/* Ajuste se platforms não for uma string única */}
              <Link
                href={link.url}
                className="ml-4 text-blue-500 hover:underline"
              >
                {link.text}
              </Link>
              <div className="flex-grow"></div>
              <button
                onClick={() => handleEditClick(link)} // Chama a função de deletar ao clicar
                className="ml-4 text-yellow-500 hover:underline"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(link.id)} // Chama a função de deletar ao clicar
                className="ml-4 text-red-500 hover:underline"
              >
                <FaRegTrashAlt />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
