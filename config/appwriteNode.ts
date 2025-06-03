"server only";

import { Account, Client, Databases, Users } from "node-appwrite";
export const nodeClient = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID))
  .setKey(String(process.env.APPWRITE_API_KEY));

export const databases = new Databases(nodeClient);

export const account = new Account(nodeClient);
export const users = new Users(nodeClient);
