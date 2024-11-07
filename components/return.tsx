"use client";

import { useRouter } from "next/navigation"; // Importa o useRouter
import { FaChevronLeft } from "react-icons/fa6";

export default function Return() {
  const router = useRouter(); // Instância do router

  return (
    <>
      <button
        onClick={() => router.back()} // Função para voltar à página anterior
        className="flex items-center space-x-2 text-black p-1.5 rounded-md lg:text-lg xl:text-xl 2xl:text-2xl underline"
      >
        <FaChevronLeft /> Voltar
      </button>

      {/* O restante do código da sua página */}
    </>
  );
}
