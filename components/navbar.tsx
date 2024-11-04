"use client";

import Link from "next/link";
import { FaXmark, FaBars } from "react-icons/fa6";
import React, { useState } from "react";
import FollowButton from "./buttonLink";

export default function Menu() {
  const [showMenu, setShowMenu] = useState(false);

  const [isMenuUp, setIsMenuUp] = useState(true);
  const combinedClickHandler = () => {
    setShowMenu(!showMenu);
    setIsMenuUp(!isMenuUp);
  };

  return (
    <>
      <nav className="bg-white h-12 lg:h-16 xl:h-24 w-full text-gray-800 m-0 p-0 flex items-center fixed z-40 lg:bg-transparent xl:justify-center">
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
            <span className="ml-6 hover:text-custom-rgb hover:text-xl">
              <Link href="/Dashboard">Dashboard</Link>
            </span>
          </li>
          <li className="ml-2">
            {" "}
            <span className="ml-6 hover:text-xl ">
              <Link href="/componentesDashboard/escolherTela">
                Escolher tela
              </Link>
            </span>
          </li>
          <li className="-ml-9  ">
            {" "}
            <span className=" hover:text-custom-rgb hover:text-xl xl:hover:text-2xl 2xl:hover:text-3xl ">
              <FollowButton />
            </span>
          </li>
          <li className="ml-2">
            {" "}
            <span className="ml-6 hover:text-xl ">
              <Link href="/componentesDashboard/conta">Configurações</Link>
            </span>
          </li>
        </ul>

        {/* Response */}

        <ul
          className={` z-50 space-x-8 text-md xl:text-lg 2xl:text-xl font-sans hidden sm:block w-full mr-14 bg-transparent xl:max-w-[3500px] `}
        >
          <div className=" flex items-center justify-end ">
            <li className=" ml-4 ">
              {" "}
              <span className="ml-2 hover:text-custom-rgb hover:text-xl xl:hover:text-2xl 2xl:hover:text-3xl">
                <Link href="/Dashboard">Dashboard</Link>
              </span>
            </li>
            <li className="ml-4  ">
              {" "}
              <span className="ml-2 hover:text-custom-rgb hover:text-xl xl:hover:text-2xl 2xl:hover:text-3xl ">
                <Link href="/componentesDashboard/escolherTela">
                  Escolher tela
                </Link>
              </span>
            </li>
            <li className="ml-4  ">
              {" "}
              <span className=" hover:text-custom-rgb hover:text-xl xl:hover:text-2xl 2xl:hover:text-3xl ">
                <FollowButton />
              </span>
            </li>
            <li className="ml-4">
              {" "}
              <span className=" hover:text-xl ">
                <Link href="/componentesDashboard/conta">Configurações</Link>
              </span>
            </li>
          </div>
        </ul>
      </nav>
    </>
  );
}
