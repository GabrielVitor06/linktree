import MyLinks from "@/components/myLinks";
import MyTitle from "@/components/myTitle";
import Menu from "@/components/navbar";

export default function Dashboard() {
  return (
    <>
      <Menu />
      <br />

      <div className="mt-12 sm:mt-44">
        <MyLinks />
        <MyTitle />
      </div>
    </>
  );
}
