import { AuthenticationApiError } from "../types";

export const getAuthenticationErrorMessages = (error: unknown): string[] => {
  if (typeof error === "object" && error !== null && "messages" in error) {
    const messages = (error as AuthenticationApiError).messages;

    if (Array.isArray(messages) && messages.length > 0) {
      return messages;
    }
  }

  if (error instanceof Error && error.message) {
    return [error.message];
  }

  return ["Something went wrong. Please try again."];
};
