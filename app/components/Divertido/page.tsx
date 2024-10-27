// pages/fun.tsx
import { FaTiktok, FaSnapchat, FaSpotify } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function FunTemplate() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 flex justify-center items-center ">
      <div className="w-full max-w-xl m-6 text-white flex flex-col items-center justify-center p-24  rounded-2xl bg-black bg-opacity-10 backdrop-blur-md">
        <Image
          className="w-28 h-28 rounded-full border-4 border-indigo-300 shadow-md"
          src="/avatar5.jpg"
          alt="Profile Avatar"
          width={150}
          height={150}
        />
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white">
          Lily Joy
        </h1>
        <p className="text-indigo-200 text-sm">Music & Dance Enthusiast</p>

        <div className="mt-12 space-y-8 w-full max-w-xs text-white text-md sm:text-lg md:text-xl lg:text-2xl">
          <Link
            href="#"
            className="block w-full bg-purple-600 py-3 rounded-2xl text-center font-semibold hover:bg-purple-700"
          >
            Portfolio
          </Link>
          <Link
            href="#"
            className="block w-full bg-purple-600 py-3 rounded-2xl text-center font-semibold hover:bg-purple-700"
          >
            Contact
          </Link>
          <Link
            href="#"
            className="block w-full bg-purple-600 py-3 rounded-2xl text-center font-semibold hover:bg-purple-700"
          >
            LinkedIn
          </Link>
          <Link
            href="#"
            className="block w-full bg-purple-600 py-3 rounded-2xl text-center font-semibold hover:bg-purple-700"
          >
            Loja
          </Link>
        </div>

        <div className="mt-8 flex space-x-6 text-white">
          <FaTiktok className="w-8 h-8 hover:text-pink-400 transition duration-200 ease-in-out" />
          <FaSnapchat className="w-8 h-8 hover:text-yellow-400 transition duration-200 ease-in-out" />
          <FaSpotify className="w-8 h-8 hover:text-green-400 transition duration-200 ease-in-out" />
        </div>
      </div>
    </div>
  );
}
