// pages/professional.tsx
import { FaBriefcase, FaLinkedinIn, FaTwitterSquare } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function ProfessionalTemplate() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800  flex justify-center items-center ">
      <div className="w-full max-w-xl m-6 text-white flex flex-col items-center justify-center p-24  rounded-2xl bg-black bg-opacity-10 backdrop-blur-md">
        <Image
          className="w-24 h-24 rounded-full border-4 border-white"
          src="/avatar4.jpg"
          alt="Profile Avatar"
          width={150}
          height={150}
        />
        <h1 className="mt-4 text-3xl font-semibold">Michael Smith</h1>
        <p>CEO & Consultant</p>

        <div className="mt-12 space-y-8 w-full max-w-xs text-white text-md sm:text-lg md:text-xl lg:text-2xl">
          <Link
            href="#"
            className="block w-full bg-gray-700 py-3 rounded-2xl text-center font-semibold hover:bg-gray-300"
          >
            Portfolio
          </Link>
          <Link
            href="#"
            className="block w-full bg-gray-700 py-3 rounded-2xl text-center font-semibold hover:bg-gray-300"
          >
            Contact
          </Link>
          <Link
            href="#"
            className="block w-full bg-gray-700 py-3 rounded-2xl text-center font-semibold hover:bg-gray-300"
          >
            LinkedIn
          </Link>
          <Link
            href="#"
            className="block w-full bg-gray-700 py-3 rounded-2xl text-center font-semibold hover:bg-gray-300"
          >
            Loja
          </Link>
        </div>

        <div className="mt-16 flex space-x-4">
          <FaBriefcase className="w-6 h-6" />
          <FaLinkedinIn className="w-6 h-6" />
          <FaTwitterSquare className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
