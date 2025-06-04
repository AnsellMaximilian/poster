"use client";

import Image from "next/image";
import logo from "@/assets/logo.svg";
import AuthForm from "@/components/AuthForm";
import { useUser } from "@/context/user/UserContext";
import { cn } from "@/lib/utils";

export default function Home() {
  const { currentUser, logout } = useUser();
  return (
    <div className="grid grid-cols-2 grow font-playpen-sans">
      <div className="flex flex-col">
        <div className="text-3xl font-bold p-4">Postr</div>
      </div>
      <div className="flex flex-col border-l border-black">
        <div className="flex p-4 items-start">
          <div className="border-b-2 pr-4 border-black flex gap-2 relative items-center">
            {currentUser && (
              <button
                onClick={logout}
                className="text-[10px] hover:underline cursor-pointer absolute top-0 right-[-20px] rotate-[30deg] "
              >
                Logout
              </button>
            )}
            <div className="">From:</div>
            <div
              className={cn(
                "cursor-pointer hover:text-muted-foreground",
                currentUser ? "" : "text-muted-foreground text-xs"
              )}
            >
              {currentUser ? currentUser.name : "You need to log in"}
            </div>
          </div>

          <Image
            src={logo}
            alt="logo"
            width={125}
            height={300}
            className="ml-auto"
          />
        </div>
        <div className="p-4 font-playpen-sans">
          {!currentUser && <AuthForm />}
        </div>
      </div>
    </div>
  );
}
