export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserData {
  bio: string | null;
  email: string;
  image: string | null;
  token: string;
  username: string;
}

export interface AuthenticationContextValue {
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (credentials: LoginCredentials) => Promise<UserData>;
  logout: () => void;
  token: string | null;
  user: UserData | null;
}

export interface AuthenticationApiError extends Error {
  messages?: string[];
}
