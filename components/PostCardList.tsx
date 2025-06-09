"use client";

import { usePostcards } from "@/context/postcards/PostcardsContext";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import React from "react";
import PostcardItem from "./PostCardItem";

export default function PostCardList() {
  const { postcards, isLoading, selectedPostcard, setSelectedPostcard } =
    usePostcards();

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Your Postcards</h2>
        <Button
          className="text-lg h-auto px-4 rotate-2 rounded-tl-none rounded-br-none"
          disabled={!selectedPostcard}
          onClick={() => {
            setSelectedPostcard(null);
          }}
        >
          Create Postcard
        </Button>
      </div>
      <div>
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : postcards.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center sm:justify-items-start">
            {postcards.map((postcard) => {
              return <PostcardItem key={postcard.$id} postcard={postcard} />;
            })}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            You currently have no postcards. Try making one!
          </div>
        )}
      </div>
    </div>
  );
}
