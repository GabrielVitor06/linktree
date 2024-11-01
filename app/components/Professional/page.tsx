// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";
// // import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// // import { getSession } from "@/lib/actions"; // Função para obter a sessão do usuário
// import { fetchUserLinks, fetchUserTitles } from "@/lib/linkActions"; // Função para buscar os links do usuário
// import Image from "next/image";
// import {
//   FaTwitter,
//   FaLinkedin,
//   FaWhatsapp,
//   FaFacebook,
//   FaInstagram,
// } from "react-icons/fa";

// export default function ProfessionalTemplate() {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const [links, setLinks] = useState<any[]>([]); // Substitua 'any' pelo tipo adequado
//   const [userTitle, setUserTitle] = useState<string | null>(null);
//   const [userSubTitle, setSubtitle] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchLinks = async () => {
//       try {
//         // Você pode definir um `userId` padrão ou remover completamente o parâmetro se a busca for para todos os usuários
//         const defaultUserId = 7; // Defina um `userId` padrão ou adapte a lógica de busca conforme necessário

//         // Buscar os links e títulos usando o `userId` padrão
//         const fetchedLinks = await fetchUserLinks(defaultUserId);
//         const fetchedTitles = await fetchUserTitles(defaultUserId);

//         // Verificar se os títulos foram encontrados
//         if (fetchedTitles && fetchedTitles[0]) {
//           setUserTitle(fetchedTitles[0].title); // Define o título do usuário
//           setSubtitle(fetchedTitles[0].subtitulo); // Define o subtítulo do usuário
//         } else {
//           setError("Título ou subtítulo não encontrados.");
//         }

//         setLinks(fetchedLinks); // Atualizar a lista de links
//       } catch (error) {
//         setError("Erro ao carregar os dados."); // Erro genérico para falhas de fetch
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLinks();
//   }, []);

//   const getIcon = (platform: string) => {
//     switch (platform) {
//       case "Twitter":
//         return <FaTwitter />;
//       case "LinkedIn":
//         return <FaLinkedin />;
//       case "WhatsApp":
//         return <FaWhatsapp />;
//       case "Facebook":
//         return <FaFacebook />;
//       case "Instagram":
//         return <FaInstagram />;
//       default:
//         return null;
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex justify-center items-center">
//       {error && <p className="text-red-500">{error}</p>}
//       <div className="font-sans m-2 text-white flex flex-col justify-center p-6 rounded-2xl">
//         <div>
//           {/* Exibindo a imagem de perfil do primeiro link apenas uma vez */}
//           {links.length > 0 && links[0].imageUrl && (
//             <div className="flex justify-center">
//               <Image
//                 className="w-24 h-24 rounded-full border-4 border-white"
//                 src={links[0].imageUrl} // Use a imagem do primeiro link
//                 alt="Profile Avatar"
//                 width={150}
//                 height={150}
//               />
//             </div>
//           )}

//           {/* Exibindo título e subtítulo do usuário */}
//           <div className="flex flex-col items-center">
//             <h1 className="mt-4 text-lg font-semibold">{userTitle}</h1>
//             <h1 className="">{userSubTitle}</h1>
//           </div>

//           {/* Mapeando apenas os links */}
//           <div className="mt-6">
//             {links.map((link) => (
//               <div
//                 key={link.id}
//                 className="mt-4 text-white text-md sm:text-lg md:text-xl lg:text-2xl"
//               >
//                 <div className="flex items-center shadow-lg border border-zinc-950 bg-zinc-800 p-1.5 pl-9 pr-9 rounded-2xl">
//                   {getIcon(link.platforms)}
//                   <Link
//                     href={link.url}
//                     className="ml-2 text-blue-500 hover:underline"
//                   >
//                     {link.text}
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="mt-16 flex justify-center space-x-4 font-sans font-extrabold">
//             Linktree
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchUserLinks, fetchUserTitles } from "@/lib/linkActions"; // Função para buscar os links do usuário
import Image from "next/image";
import {
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import { getSession } from "@/lib/actions"; // Função para obter a sessão do usuário
import { useRouter } from "next/navigation";
import { getUserIdByUsernames } from "@/lib/publicActions";
import { useParams } from "next/navigation";

export default function ProfessionalTemplate() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [links, setLinks] = useState<any[]>([]); // Substitua 'any' pelo tipo adequado
  const [userTitle, setUserTitle] = useState<string | null>(null);
  const [userSubTitle, setSubtitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { username } = useParams();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        if (typeof username === "string") {
          // Garante que username seja uma string
          // Busca o userId baseado no username
          const userId = await getUserIdByUsernames(username);

          if (userId === null) {
            setError("Usuário não encontrado.");
            return; // Para se o usuário não for encontrado
          }

          // Buscar os links e títulos usando o userId encontrado
          const fetchedLinks = await fetchUserLinks(userId);
          const fetchedTitles = await fetchUserTitles(userId);

          // Verificar se os títulos foram encontrados
          if (fetchedTitles && fetchedTitles[0]) {
            setUserTitle(fetchedTitles[0].title); // Define o título do usuário
            setSubtitle(fetchedTitles[0].subtitulo); // Define o subtítulo do usuário
          } else {
            setError("Título ou subtítulo não encontrados.");
          }

          setLinks(fetchedLinks); // Atualizar a lista de links
        }
      } catch (error) {
        setError("Erro ao carregar os dados."); // Erro genérico para falhas de fetch
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      // Verifica se o username está definido antes de buscar os links
      fetchLinks();
    }
  }, [username]); // O efeito depende do username

  // useEffect(() => {
  //   const fetchLinks = async () => {
  //     try {
  //       const session = await getSession(); // Obtendo a sessão do usuário

  //       // Define um userId padrão caso o usuário não esteja autenticado
  //       const userId = session && session.id ? Number(session.id) : 7; // Substitua 7 pelo ID padrão desejado

  //       // Buscar os links e títulos usando o userId
  //       const fetchedLinks = await fetchUserLinks(userId);
  //       const fetchedTitles = await fetchUserTitles(userId);

  //       // Verificar se os títulos foram encontrados
  //       if (fetchedTitles && fetchedTitles[0]) {
  //         setUserTitle(fetchedTitles[0].title); // Define o título do usuário
  //         setSubtitle(fetchedTitles[0].subtitulo); // Define o subtítulo do usuário
  //       } else {
  //         setError("Título ou subtítulo não encontrados.");
  //       }

  //       setLinks(fetchedLinks); // Atualizar a lista de links
  //     } catch (error) {
  //       setError("Erro ao carregar os dados."); // Erro genérico para falhas de fetch
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchLinks();
  // }, []);

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
      <div className="font-sans m-2 text-white flex flex-col justify-center p-6 rounded-2xl">
        <div>
          {/* Exibindo a imagem de perfil do primeiro link apenas uma vez */}
          {links.length > 0 && links[0].imageUrl && (
            <div className="flex justify-center">
              <Image
                className="w-24 h-24 rounded-full border-4 border-white"
                src={links[0].imageUrl} // Use a imagem do primeiro link
                alt="Profile Avatar"
                width={150}
                height={150}
              />
            </div>
          )}

          {/* Exibindo título e subtítulo do usuário */}
          <div className="flex flex-col items-center">
            <h1 className="mt-4 text-lg font-semibold">{userTitle}</h1>
            <h1 className="">{userSubTitle}</h1>
          </div>

          {/* Mapeando apenas os links */}
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
