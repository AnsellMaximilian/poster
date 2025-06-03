"use client";

import { account, config, databases } from "@/config/appwrite";
import { ReactNode, useEffect, useState } from "react";
import { UserContext } from "@/context/user/UserContext";
import { User, UserProfile } from "@/types/user";
// import Loader from "@/components/Loader";
import { getErrorMessage } from "@/lib/utils";
import { toastError } from "@/lib/ui";
import { ID } from "appwrite";

export const UserContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const getAccount = async () => {
    try {
      setIsLoading(true);
      const user = await account.get();
      let profile: null | UserProfile = null;
      try {
        profile = (await databases.getDocument(
          config.dbId,
          config.userProfileCollectionId,
          user.$id
        )) as UserProfile;
      } catch {
        profile = null;
      }

      setCurrentUser({ ...user, profile: profile });
    } catch {
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsProcessing(true);
      await account.createEmailPasswordSession(email, password);
      await getAccount();
    } catch (error) {
      toastError(getErrorMessage(error));
    } finally {
      setIsProcessing(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setIsProcessing(true);
      await account.create(ID.unique(), email, password, name);
    } catch (error) {
      toastError(getErrorMessage(error));
    } finally {
      setIsProcessing(false);
    }
  };

  const logout = async () => {
    setIsProcessing(true);
    await account.deleteSession("current");
    setCurrentUser(null);
    setIsProcessing(false);
  };

  useEffect(() => {
    getAccount();
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isLoading,
        isProcessing,
        setCurrentUser,
        login,
        logout,
        register,
      }}
    >
      {/* {isLoading && <Loader />}
      {isLoading === false && <>{children}</>} */}
      {children}
    </UserContext.Provider>
  );
};
