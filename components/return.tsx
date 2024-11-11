"use client";

import { useRouter } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa6";

export default function Return() {
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-black p-1.5 rounded-md lg:text-lg xl:text-xl 2xl:text-2xl underline"
      >
        <FaChevronLeft /> Voltar
      </button>
    </>
  );
}
