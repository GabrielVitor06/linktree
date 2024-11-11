import MyLinks from "@/components/myLinks";
import MyTitle from "@/components/myTitle";
import Menu from "@/components/navbar";
import Link from "next/link";
import { MdAddToHomeScreen } from "react-icons/md";

export default function Dashboard() {
  return (
    <>
      <Menu />
      <br />
      <div className="flex justify-center items-center space-x-2 font-bold underline text-lg lg:text-xl xl:text-2xl text-blue-600 hover:text-blue-700 mt-14">
        <MdAddToHomeScreen className="text-black" />
        <Link href={"/componentesDashboard/escolherTela"}>
          Escolha sua tela
        </Link>
      </div>
      <div className="mt-4 sm:mt-10">
        <MyLinks />
        <MyTitle />
      </div>
    </>
  );
}
