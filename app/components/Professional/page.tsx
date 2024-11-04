/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchUserLinks, fetchUserTitles } from "@/lib/linkActions";
import Image from "next/image";
import {
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import { getUserIdByUsernames } from "@/lib/publicActions";
import { useParams } from "next/navigation";

export default function ProfessionalTemplate() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [links, setLinks] = useState<any[]>([]);
  const [userTitle, setUserTitle] = useState<string | null>(null);
  const [userSubTitle, setSubtitle] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { username } = useParams();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        if (typeof username === "string") {
          const userId = await getUserIdByUsernames(username);

          if (userId === null) {
            setError("Usuário não encontrado.");
            return;
          }

          const fetchedLinks = await fetchUserLinks(userId);
          const fetchedTitles = await fetchUserTitles(userId);

          if (fetchedTitles && fetchedTitles[0]) {
            setUserTitle(fetchedTitles[0].title);
            setSubtitle(fetchedTitles[0].subtitulo);
            setImageUrl(fetchedTitles[0].imageUrl);
          } else {
            setError("Título ou subtítulo não encontrados.");
          }

          setLinks(fetchedLinks);
        }
      } catch (error) {
        setError("Erro ao carregar os dados.");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchLinks();
    }
  }, [username]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex justify-center items-center">
      {error && <p className="text-red-500">{error}</p>}
      <div className="font-sans text-white flex flex-col justify-center p-6 rounded-2xl">
        <div>
          {imageUrl && (
            <div className="flex justify-center">
              <img
                className="w-24 h-24 lg:w-28 lg:h-28 xl:w-28 xl:h-32 rounded-full border border-zinc-900"
                src={imageUrl}
                alt="Profile Avatar"
                width={150}
                height={150}
              />
            </div>
          )}

          <div className="flex flex-col items-center">
            <h1 className="mt-8 text-lg lg:text-xl xl:text-2xl font-semibold">
              {userTitle}
            </h1>
            <h1 className="text-md lg:text-lg xl:text-xl">{userSubTitle}</h1>
          </div>

          <div className="mt-6">
            {links.map((link) => (
              <div
                key={link.id}
                className="mt-4 text-white text-md sm:text-lg md:text-xl lg:text-2xl"
              >
                <div className="flex items-center shadow-lg border border-zinc-950 bg-zinc-800 p-1.5 pl-9 pr-9 rounded-2xl">
                  {getIcon(link.platforms)}
                  <Link
                    href={link.url}
                    className="ml-2 text-blue-500 hover:underline"
                  >
                    {link.text}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center space-x-4 font-sans font-extrabold">
            Linktree
          </div>
        </div>
      </div>
    </div>
  );
}
