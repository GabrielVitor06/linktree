import MyLinks from "@/components/myLinks";
import MyTitle from "@/components/myTitle";
import Menu from "@/components/navbar";
import Link from "next/link";

export default function Dashboard() {
  return (
    <>
      <Menu />
      <br />
      <div className="flex justify-center font-bold underline text-blue-600 hover:text-blue-700 mt-14">
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
