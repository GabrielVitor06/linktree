"use client";

import Link from "next/link";
import { FaXmark, FaBars, FaGear } from "react-icons/fa6";
import React, { useState } from "react";
import FollowButton from "./buttonLink";
import { MdOutlineDashboard } from "react-icons/md";

export default function Menu() {
  const [showMenu, setShowMenu] = useState(false);

  const [isMenuUp, setIsMenuUp] = useState(true);
  const combinedClickHandler = () => {
    setShowMenu(!showMenu);
    setIsMenuUp(!isMenuUp);
  };

  return (
    <>
      <nav className="bg-gray-100 h-12 lg:h-16 w-full text-gray-800 m-0 p-0 flex items-center fixed z-40  xl:justify-center">
        <h1 className="ml-4 font-bold text-sm  lg:text-xl xl:text-2xl 2xl:text-3xl lg:w-96">
          Linktree
        </h1>
        <button
          className="flex flex-1 justify-end text-2xl mr-4 sm:hidden"
          onClick={combinedClickHandler}
        >
          <span>{isMenuUp ? <FaBars /> : <FaXmark />}</span>
        </button>
        <ul
          className={` ${
            showMenu ? "left-0" : "left-[-400px]"
          } z-50 bg-white text-gray-800 space-y-4 text-lg font-sans top-0 w-52 md-flex fixed m-0 h-screen transition-all delay-500 ease-in duration-500`}
        >
          <li className="mt-16 ml-2 ">
            {" "}
            <span className="ml-6 hover:text-custom-rgb hover:text-xl space-x-2 flex items-center">
              <MdOutlineDashboard />
              <Link href="/Dashboard" className="underline">
                Dashboard
              </Link>
            </span>
          </li>

          <li className=" ">
            {" "}
            <span className=" hover:text-custom-rgb hover:text-xl xl:hover:text-2xl 2xl:hover:text-3xl ">
              <FollowButton />
            </span>
          </li>
          <li className="ml-2">
            {" "}
            <span className="ml-6 hover:text-xl space-x-2  flex items-center">
              <FaGear />
              <Link href="/componentesDashboard/conta" className="underline">
                Configurações
              </Link>
            </span>
          </li>
        </ul>

        {/* Response */}

        <ul
          className={`  z-50 space-x-8 text-md xl:text-lg 2xl:text-xl font-sans hidden sm:block w-full mr-14 bg-transparent xl:max-w-[3500px] `}
        >
          <div className=" flex items-center justify-end ">
            <li className=" ml-5 ">
              {" "}
              <span className="ml-6 hover:text-custom-rgb hover:text-xl space-x-2 flex items-center">
                <MdOutlineDashboard />
                <Link href="/Dashboard" className="underline">
                  Dashboard
                </Link>
              </span>
            </li>
            <li className="ml-5  ">
              {" "}
              <span className=" hover:text-custom-rgb hover:text-xl xl:hover:text-2xl 2xl:hover:text-3xl ">
                <FollowButton />
              </span>
            </li>
            <li className="ml-5">
              {" "}
              <span className=" hover:text-xl space-x-2  flex items-center">
                <FaGear />
                <Link href="/componentesDashboard/conta" className="underline">
                  Configurações
                </Link>
              </span>
            </li>
          </div>
        </ul>
      </nav>
    </>
  );
}
