"use client";

import { usePostcards } from "@/context/postcards/PostcardsContext";
import { cn } from "@/lib/utils";
import { Postcard } from "@/types/postcard";
import { useMemo } from "react";

const POSTIT_COLORS = [
  "#fef3bd", // light yellow
  "#ffd8be", // peach
  "#b8f2e6", // mint
  "#caffbf", // lime
  "#fdffb6", // light yellow
  "#a0c4ff", // baby blue
  "#ffc6ff", // light pink
];

export default function PostCardItem({ postcard }: { postcard: Postcard }) {
  const { selectedPostcard, setSelectedPostcard } = usePostcards();
  const color = useMemo(() => {
    // Pick a random but consistent color based on postcard ID
    const index =
      postcard.$id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
      POSTIT_COLORS.length;
    return POSTIT_COLORS[index];
  }, [postcard.$id]);

  return (
    <div
      className={cn(
        "relative w-72 sm:w-48 aspect-[4/5] rounded-md shadow-md p-3 flex flex-col justify-between",
        "cursor-pointer transition-transform hover:scale-105",
        selectedPostcard?.$id === postcard.$id
          ? "scale-110 hover:scale-110 rotate-6"
          : ""
      )}
      onClick={() => {
        setSelectedPostcard(postcard);
      }}
      style={{
        backgroundColor: color,
      }}
    >
      {/* Tape */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-3 bg-neutral-200 rotate-2 rounded-b-sm shadow-sm z-10" />

      <div>
        <div className="text-xs font-bold line-clamp-5 flex justify-between">
          [{postcard.$id}]
        </div>

        <div className="text-xs">
          {postcard.finalReplyHtml
            ? "Email Generated"
            : postcard.messageId
            ? "Waiting for Replies"
            : "Waiting for Inbound"}
        </div>
      </div>

      {/* Content */}
      <div className="text-xs font-medium line-clamp-5">
        {postcard.emailBody ?? "No message yet."}
      </div>
      <div className="text-[0.6rem] text-gray-700 mt-2">
        — {postcard.fromName ?? "Waiting for Inbound Email"}
      </div>
    </div>
  );
}
