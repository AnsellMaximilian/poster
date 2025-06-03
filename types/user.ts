import { Models } from "appwrite";

export type User = Models.User<Models.Preferences> & {
  profile: UserProfile | null;
};

export type UserProfile = Models.Document & {
  numberOfAttempts: number;
  latestAttemptDateTime: string | null;
};
