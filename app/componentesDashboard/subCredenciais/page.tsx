"use client";

import { useState } from "react";
import { Titles } from "@/lib/actions";

export default function Subcredenciais() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const result = await Titles(formData);
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
      <h1 className="text-lg lg:text-xl xl:text-2xl font-bold mb-8 text-gray-800">
        TÍTULOS
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded w-full"
      >
        <div className="mb-2">
          <label
            htmlFor="title"
            className="block text-gray-700 font-medium mb-2"
          >
            Título
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
          />
        </div>
        <div className="mb-2">
          <label
            htmlFor="subtitulo"
            className="block text-gray-700 font-medium mb-2"
          >
            Subtítulo
          </label>
          <input
            type="text"
            name="subtitulo"
            id="subtitulo"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
          />
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
