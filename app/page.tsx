"use client";

import Image from "next/image";
import logo from "@/assets/logo.svg";
import AuthForm from "@/components/AuthForm";

export default function Home() {
  return (
    <div className="grid grid-cols-2 grow">
      <div className="flex flex-col">
        <div className="text-3xl font-bold p-4 font-playpen-sans">Postr</div>
      </div>
      <div className="flex flex-col border-l border-black">
        <div className="ml-auto p-4">
          <Image src={logo} alt="logo" width={125} height={300} />
        </div>
        <div className="p-4 font-playpen-sans">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
