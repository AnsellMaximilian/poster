"use client";

import { client, config, databases } from "@/config/appwrite";
import { ReactNode, useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/utils";
import { toastError } from "@/lib/ui";
import { Query } from "appwrite";
import { Postcard } from "@/types/postcard";
import { PostcardContext } from "@/context/postcards/PostcardsContext";
import { useUser } from "@/context/user/UserContext";

export const PostcardContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { currentUser } = useUser();

  const [postcards, setPostcards] = useState<Postcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedPostcard, setSelectedPostcard] = useState<Postcard | null>(
    null
  );

  useEffect(() => {
    (async () => {
      if (!currentUser) return;
      try {
        setIsLoading(true);
        const res = await databases.listDocuments<Postcard>(
          config.dbId,
          config.postcardCollectionId,
          [Query.equal("userId", currentUser.$id)]
        );

        const data = res.documents as Postcard[];

        setPostcards(data);
      } catch (error) {
        toastError(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    })();
  }, [currentUser]);

  useEffect(() => {
    if (!selectedPostcard) return;

    const unsubscribe = client.subscribe(
      `databases.${config.dbId}.collections.${config.postcardCollectionId}.documents.${selectedPostcard.$id}`,
      (res) => {
        const postcard = res.payload as Postcard;
        console.log({ updaterbro: postcard });
        setPostcards((prev) =>
          prev.map((p) => (p.$id === postcard.$id ? postcard : p))
        );
        setSelectedPostcard(postcard);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [selectedPostcard]);

  return (
    <PostcardContext.Provider
      value={{
        postcards,
        setPostcards,
        isLoading,
        selectedPostcard,
        setSelectedPostcard,
      }}
    >
      {children}
    </PostcardContext.Provider>
  );
};
