import { AuthenticationApiError, LoginCredentials, UpdateUserInput, UserData } from "../authentication/types";
import { API_URL } from "./config";

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(path: string, { token, ...options }: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const payload = await response.json();

  if (!response.ok) {
    const error = new Error("Authentication request failed.") as AuthenticationApiError;
    const responseErrors = payload?.errors;

    if (responseErrors && typeof responseErrors === "object") {
      error.messages = Object.entries(responseErrors).flatMap(([field, messages]) =>
        Array.isArray(messages)
          ? messages.map((message) => `${field} ${message}`)
          : [`${field} ${String(messages)}`]
      );
    } else {
      error.messages = ["Authentication request failed."];
    }

    throw error;
  }

  return payload as T;
}

export async function loginUser(credentials: LoginCredentials): Promise<UserData> {
  const payload = await request<{ user: UserData }>("/users/login", {
    body: JSON.stringify({
      user: credentials,
    }),
    method: "POST",
  });

  return payload.user;
}

export async function getCurrentUser(token: string): Promise<UserData> {
  const payload = await request<{ user: UserData }>("/user", { token });

  return payload.user;
}

export async function updateCurrentUser(user: UpdateUserInput, token: string): Promise<UserData> {
  const payload = await request<{ user: UserData }>("/user", {
    body: JSON.stringify({
      user,
    }),
    method: "PUT",
    token,
  });

  return payload.user;
}
