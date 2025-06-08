"use client";

import { client, config, databases } from "@/config/appwrite";
import { ReactNode, useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/utils";
import { toastError } from "@/lib/ui";
import { Models, Query } from "appwrite";
import { Postcard, PostcardResponse } from "@/types/postcard";
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

  const [selectedPostcardResponses, setSelectedPostcardResponses] = useState<
    PostcardResponse[]
  >([]);

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
    const unsubscribe = client.subscribe<Models.Document>(
      `databases.${config.dbId}.collections.${config.postcardCollectionId}.documents`,
      (res) => {
        if (res.payload.$collectionId === config.postcardCollectionId) {
          const postcard = res.payload as Postcard;
          console.log({ updaterbro: postcard });
          setPostcards((prev) =>
            prev.map((p) => (p.$id === postcard.$id ? postcard : p))
          );
          setSelectedPostcard(postcard);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (selectedPostcard) {
      (async () => {
        try {
          setIsLoading(true);
          const res = await databases.listDocuments<PostcardResponse>(
            config.dbId,
            config.postcardResponseCollectionId,
            [Query.equal("postcardId", selectedPostcard.$id)]
          );

          const data = res.documents as PostcardResponse[];

          setSelectedPostcardResponses(data);
        } catch (error) {
          toastError(getErrorMessage(error));
        } finally {
          setIsLoading(false);
        }
      })();
    } else {
      setSelectedPostcardResponses([]);
    }
  }, [selectedPostcard]);

  useEffect(() => {
    const unsubscribe = client.subscribe<Models.Document>(
      `databases.${config.dbId}.collections.${config.postcardResponseCollectionId}.documents`,
      (res) => {
        if (res.payload.$collectionId === config.postcardResponseCollectionId) {
          const postcardResponse = res.payload as PostcardResponse;
          console.log({ updatedPostcardResponse: postcardResponse });

          setSelectedPostcardResponses((prev) =>
            prev.map((p) =>
              p.$id === postcardResponse.$id ? postcardResponse : p
            )
          );
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <PostcardContext.Provider
      value={{
        postcards,
        setPostcards,
        isLoading,
        selectedPostcard,
        setSelectedPostcard,
        selectedPostcardResponses,
        setSelectedPostcardResponses,
      }}
    >
      {children}
    </PostcardContext.Provider>
  );
};
