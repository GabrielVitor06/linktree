// pages/neutral.tsx
import { FaFacebook, FaPinterest, FaYoutube } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function NeutralTemplate() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center ">
      <div className="w-full max-w-xl m-6 text-gray-800 flex flex-col items-center justify-center p-24  rounded-2xl bg-black bg-opacity-10 backdrop-blur-md">
        <Image
          className="w-24 h-24 rounded-full"
          src="/avatar3.jpg"
          alt="Profile Avatar"
          width={150}
          height={150}
        />
        <h1 className="mt-4 text-2xl font-bold">Alex Doe</h1>
        <p className="text-gray-500">Content Creator</p>

        <div className="mt-12 space-y-8 w-full max-w-xs text-gray-800 text-md sm:text-lg md:text-xl lg:text-2xl">
          <Link
            href="#"
            className="block w-full bg-gray-200 py-3 rounded-2xl text-center font-semibold hover:bg-gray-300"
          >
            Portfolio
          </Link>
          <Link
            href="#"
            className="block w-full bg-gray-200 py-3 rounded-2xl text-center font-semibold hover:bg-gray-300"
          >
            Contact
          </Link>
          <Link
            href="#"
            className="block w-full bg-gray-200 py-3 rounded-2xl text-center font-semibold hover:bg-gray-300"
          >
            LinkedIn
          </Link>
          <Link
            href="#"
            className="block w-full bg-gray-200 py-3 rounded-2xl text-center font-semibold hover:bg-gray-300"
          >
            Loja
          </Link>
        </div>

        <div className="mt-16 flex space-x-4">
          <FaFacebook className="w-6 h-6" />
          <FaPinterest className="w-6 h-6" />
          <FaYoutube className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
