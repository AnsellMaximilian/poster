"use client";

import Image from "next/image";
import logo from "@/assets/logo.svg";
import AuthForm from "@/components/AuthForm";
import { useUser } from "@/context/user/UserContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PostcardForm } from "@/components/PostcardForm";
import PostCardList from "@/components/PostCardList";
import { usePostcards } from "@/context/postcards/PostcardsContext";
import PostcardDetail from "@/components/PostCardDetail";
import { AnimatePresence, motion } from "framer-motion";

const fadeVariant = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export default function Home() {
  const { currentUser, logout } = useUser();
  const { selectedPostcard } = usePostcards();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 grow font-playpen-sans">
      <div className="flex flex-col row-start-2 md:row-start-1">
        <div className="text-3xl font-bold p-4">Postr</div>
        <div className="p-4 grow flex flex-col">
          {currentUser && <PostCardList />}
        </div>
      </div>
      <div className="flex flex-col md:border-l border-black">
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
        <div className="p-4 font-playpen-sans grow flex flex-col">
          <AnimatePresence mode="wait">
            {!currentUser ? (
              <motion.div
                key="auth"
                variants={fadeVariant}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <AuthForm />
              </motion.div>
            ) : selectedPostcard ? (
              <motion.div
                key="detail"
                variants={fadeVariant}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <PostcardDetail postcard={selectedPostcard} />
              </motion.div>
            ) : (
              <motion.div
                key="form"
                variants={fadeVariant}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <PostcardForm />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-auto flex justify-end pb-4">
            <Dialog>
              <DialogTrigger asChild>
                {/* <Button className="text-2xl py-2 h-auto px-6 rotate-2 rounded-tl-none rounded-br-none">
                  Swagger
                </Button> */}
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Postcard Created!</DialogTitle>
                  <DialogDescription>
                    Postcard has been created. You are now ready to send an
                    email to your peers.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <div>bla bla bla bla</div>
                  <Button>Create</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
