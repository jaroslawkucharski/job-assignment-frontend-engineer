export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UpdateUserInput {
  bio?: string;
  email?: string;
  image?: string;
  password?: string;
  username?: string;
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
  updateUser: (user: UpdateUserInput) => Promise<UserData>;
  user: UserData | null;
}

export interface AuthenticationApiError extends Error {
  messages?: string[];
}
