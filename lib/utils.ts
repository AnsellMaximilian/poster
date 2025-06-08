import { ApiResponse } from "@/types/common";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    throw new Error("Failed to copy text to clipboard");
  }
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown) {
  let errorMsg = "Unkown Error";

  if (error instanceof Error) errorMsg = error.message;

  return errorMsg;
}

export function getSuccessApiResponse<T>(
  data: T,
  message?: string
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function getErrorApiResponse(
  message?: string,
  error?: unknown
): ApiResponse<null> {
  return {
    data: null,
    message: error ? getErrorMessage(error) : message,
    success: false,
  };
}

export function isSameUTCDate(
  a: Date | string | undefined,
  b: Date | string
): boolean {
  if (!a) return false;

  const dateA = typeof a === "string" ? new Date(a) : a;
  const dateB = typeof b === "string" ? new Date(b) : b;

  return (
    dateA.getUTCFullYear() === dateB.getUTCFullYear() &&
    dateA.getUTCMonth() === dateB.getUTCMonth() &&
    dateA.getUTCDate() === dateB.getUTCDate()
  );
}

export function unwrapJsonFence(input: string): string {
  const jsonFenceRegex = /^```(?:json)?\s*([\s\S]*?)\s*```$/i;

  const match = input.trim().match(jsonFenceRegex);
  if (match) {
    return match[1].trim();
  }

  return input
    .trim()
    .replace(/^\s*```(?:json)?\s*/, "")
    .replace(/\s*```$/, "")
    .trim();
}
