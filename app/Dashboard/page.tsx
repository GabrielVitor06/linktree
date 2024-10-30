/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import MyLinks from "@/components/myLinks";
import MyTitle from "@/components/myTitle";

export default function Dashboard() {
  return (
    <>
      <MyLinks />
      <MyTitle />
      <section className="w-full max-w-xl h-full max-h-96"></section>
    </>
  );
}
