// "use client";
// import { useState } from "react";
// import { linktree } from "@/lib/actions";
// import { useRouter } from "next/navigation";
// import {
//   FaTwitter,
//   FaLinkedin,
//   FaWhatsapp,
//   FaFacebook,
//   FaInstagram,
// } from "react-icons/fa";

// export default function LinkTree() {
//   const [message, setMessage] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null); // Usando o estado de erro
//   const router = useRouter();
//   const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     const formData = new FormData(event.currentTarget);

//     // Adicionando plataformas selecionadas ao FormData
//     selectedPlatforms.forEach((platform) => {
//       formData.append("platforms", platform);
//     });

//     const result = await linktree(formData);
//     console.log(result);

//     if (result.success) {
//       setMessage("Link enviado com sucesso!");
//       setError(null); // Reseta o erro se bem-sucedido
//       router.push("/createLinktree/escolherTela");
//     } else {
//       setError(result.error || "Ocorreu um erro. Tente novamente.");
//       setMessage(null); // Reseta a mensagem de sucesso se houver erro
//     }
//   };

//    // Função para obter o ícone correspondente
//    const getIconForPlatform = (platform) => {
//     switch (platform) {
//       case "Twitter":
//         return "FaTwitter";
//       case "LinkedIn":
//         return "FaLinkedin";
//       case "WhatsApp":
//         return "FaWhatsapp";
//       case "Facebook":
//         return "FaFacebook";
//       case "Instagram":
//         return "FaInstagram";
//       default:
//         return null;
//     }
//   };
//   // Função para renderizar o ícone
//   // const getIcon = (iconName) => {
//   //   switch (iconName) {
//   //     case "FaTwitter":
//   //       return <FaTwitter />;
//   //     case "FaLinkedin":
//   //       return <FaLinkedin />;
//   //     case "FaWhatsapp":
//   //       return <FaWhatsapp />;
//   //     case "FaFacebook":
//   //       return <FaFacebook />;
//   //     case "FaInstagram":
//   //       return <FaInstagram />;
//   //     default:
//   //       return null;
//   //   }
//   // };

//   return (
//     <>
//       <div className="flex flex-col items-center justify-center mt-16">
//         <h1 className="text-4xl font-bold mb-8 text-gray-800">ADD LINK</h1>

//         <form
//           onSubmit={handleSubmit}
//           className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3"
//         >
//           <div className="mb-6">
//             <label
//               htmlFor="text"
//               className="block text-gray-700 font-medium mb-2"
//             >
//               Texto
//             </label>
//             <input
//               type="text"
//               name="text"
//               id="text"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
//               required
//             />
//           </div>

//           <div className="mb-6">
//             <label
//               htmlFor="url"
//               className="block text-gray-700 font-medium mb-2"
//             >
//               URL
//             </label>
//             <input
//               type="url"
//               name="url"
//               id="url"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
//               required
//             />
//           </div>

//           <h1 className="block text-gray-700 font-medium mb-2">Escolha:</h1>
//           <div className="flex flex-col mt-4 space-y-2">
//             {[
//               {
//                 name: "Twitter",
//                 icon: <FaTwitter className="text-blue-500" />,
//               },
//               {
//                 name: "LinkedIn",
//                 icon: <FaLinkedin className="text-blue-700" />,
//               },
//               {
//                 name: "WhatsApp",
//                 icon: <FaWhatsapp className="text-green-500" />,
//               },
//               {
//                 name: "Facebook",
//                 icon: <FaFacebook className="text-blue-600" />,
//               },
//               {
//                 name: "Instagram",
//                 icon: <FaInstagram className="text-pink-500" />,
//               },
//             ].map((platform) => (
//               <label key={platform.name} className="flex items-center">
//                 <input
//                   type="checkbox"
//                   value={platform.name}
//                   onChange={(e) => {
//                     if (e.target.checked) {
//                       setSelectedPlatforms((prev) => [...prev, platform.name]);
//                     } else {
//                       setSelectedPlatforms((prev) =>
//                         prev.filter((p) => p !== platform.name)
//                       );
//                     }
//                   }}
//                   className="mr-2"
//                 />
//                 {platform.icon}
//                 <span className="ml-2">{platform.name}</span>
//               </label>
//             ))}
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors mt-8"
//           >
//             Enviar
//           </button>
//         </form>

//         {/* Exibindo a mensagem de sucesso ou erro */}
//         {message && (
//           <p className="mt-4 text-lg font-semibold text-green-500">{message}</p>
//         )}
//         {error && (
//           <p className="mt-4 text-lg font-semibold text-red-500">{error}</p>
//         )}
//       </div>
//     </>
//   );
// }

// src/app/createLinktree/LinkTree.tsx
"use client";

import { useState } from "react";
import { linktree } from "@/lib/actions";
import { useRouter } from "next/navigation";
import {
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";

export default function LinkTree() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    selectedPlatforms.forEach((platform) => {
      formData.append("platforms", platform);
    });

    const result = await linktree(formData);
    console.log(result);

    if (result.success) {
      setMessage("Link enviado com sucesso!");
      setError(null);
      router.push("/createLinktree/escolherTela");
    } else {
      setError(result.error || "Ocorreu um erro. Tente novamente.");
      setMessage(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-16">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">ADD LINK</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3"
      >
        <div className="mb-6">
          <label
            htmlFor="text"
            className="block text-gray-700 font-medium mb-2"
          >
            Texto
          </label>
          <input
            type="text"
            name="text"
            id="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="url" className="block text-gray-700 font-medium mb-2">
            URL
          </label>
          <input
            type="url"
            name="url"
            id="url"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
          />
        </div>

        <h1 className="block text-gray-700 font-medium mb-2">Escolha:</h1>
        <div className="flex flex-col mt-4 space-y-2">
          {[
            { name: "Twitter", icon: <FaTwitter className="text-blue-500" /> },
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
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedPlatforms((prev) => [...prev, platform.name]);
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

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors mt-8"
        >
          Enviar
        </button>
      </form>

      {message && (
        <p className="mt-4 text-lg font-semibold text-green-500">{message}</p>
      )}
      {error && (
        <p className="mt-4 text-lg font-semibold text-red-500">{error}</p>
      )}
    </div>
  );
}
