import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Indie_Flower,
  Playpen_Sans,
} from "next/font/google";
import "./globals.css";
import { UserContextProvider } from "@/context/user/UserContextProvider";
import { Toaster } from "@/components/ui/sonner";
import { PostcardContextProvider } from "@/context/postcards/PostcardsContextProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const indieFlower = Indie_Flower({
  weight: "400",
  variable: "--font-indie-flower",
  subsets: ["latin"],
});

const playpenSans = Playpen_Sans({
  variable: "--font-playpen-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Postr",
  description: "Powered by Postmark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${indieFlower.variable} ${playpenSans.variable} min-h-screen antialiased relative bg-white shadow-md w-full mx-auto rounded-sm border-[12px] border-solid flex flex-col`}
        style={{
          borderImage: `repeating-linear-gradient(
    45deg,
    #f00 0 10px,
    #fff 10px 20px,
    #00f 20px 30px,
    #fff 30px 40px
  ) 12`,
        }}
      >
        <UserContextProvider>
          <PostcardContextProvider>{children}</PostcardContextProvider>
        </UserContextProvider>
        <Toaster />
      </body>
    </html>
  );
}
