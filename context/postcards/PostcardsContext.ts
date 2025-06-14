import { Postcard, PostcardResponse } from "@/types/postcard";
import { createContext, Dispatch, SetStateAction, useContext } from "react";
export interface PostcardContextData {
  postcards: Postcard[];
  setPostcards: Dispatch<SetStateAction<Postcard[]>>;
  isLoading: boolean;

  selectedPostcard: Postcard | null;
  setSelectedPostcard: Dispatch<SetStateAction<Postcard | null>>;

  selectedPostcardResponses: PostcardResponse[];
  setSelectedPostcardResponses: Dispatch<SetStateAction<PostcardResponse[]>>;
}

export const PostcardContext = createContext<PostcardContextData>({
  postcards: [],
  setPostcards: () => {},
  isLoading: true,

  selectedPostcard: null,
  setSelectedPostcard: () => {},

  selectedPostcardResponses: [],
  setSelectedPostcardResponses: () => {},
});

export const usePostcards = (): PostcardContextData => {
  const context = useContext(PostcardContext);
  if (!context) {
    throw new Error(
      "usePostcards must be used within a corresponding ContextProvider"
    );
  }
  return context;
};
