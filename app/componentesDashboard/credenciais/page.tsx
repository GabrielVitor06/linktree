"use client";

import { useState } from "react";
import { linktree } from "@/lib/actions";

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
      window.location.reload();
    } else {
      setError(result.error || "Ocorreu um erro. Tente novamente.");
      setMessage(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-lg lg:text-xl xl:text-2xl font-bold mb-6 text-gray-800">
        LINKS
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded w-full"
      >
        <div className="mb-4">
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
        <div className="mb-4">
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

        <h1 className="block text-gray-700 font-medium mb-2 ">Escolha:</h1>
        <div className="flex flex-col mt-4 space-y-2 sm:grid sm:grid-cols-3 sm:flex-none">
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
