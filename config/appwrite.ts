import { Client, Account, Databases, Functions } from "appwrite";

export const config = {
  projectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
  dbId: String(process.env.NEXT_PUBLIC_DB_ID),
};

export const client = new Client();

client.setEndpoint("https://cloud.appwrite.io/v1").setProject(config.projectId);

export const account = new Account(client);

export const databases = new Databases(client);

export const functions = new Functions(client);
