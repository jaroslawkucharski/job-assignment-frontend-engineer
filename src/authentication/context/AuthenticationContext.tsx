import React, { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser, loginUser, updateCurrentUser } from "../../api/authentication";
import { clearStoredToken, readStoredToken, storeSessionToken } from "../helpers/authenticationStorage";
import { AuthenticationContextValue, LoginCredentials, UpdateUserInput, UserData } from "../types";
import { WithChildrenProps } from "../../types/common";

export const AuthenticationContext = createContext<AuthenticationContextValue | undefined>(undefined);

export const AuthenticationProvider = ({ children }: WithChildrenProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const storedToken = readStoredToken();

    if (!storedToken) {
      setIsBootstrapping(false);
      return;
    }

    setToken(storedToken);

    getCurrentUser(storedToken)
      .then((nextUser) => {
        setUser(nextUser);
      })
      .catch(() => {
        clearStoredToken();
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setIsBootstrapping(false);
      });
  }, []);

  const login = async (credentials: LoginCredentials): Promise<UserData> => {
    const nextUser = await loginUser(credentials);

    storeSessionToken(nextUser.token);
    setToken(nextUser.token);
    setUser(nextUser);

    return nextUser;
  };

  const logout = (): void => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  };

  const updateUser = async (nextUserData: UpdateUserInput): Promise<UserData> => {
    if (!token) {
      throw new Error("You need to be logged in to update settings.");
    }

    const nextUser = await updateCurrentUser(nextUserData, token);

    storeSessionToken(nextUser.token);
    setToken(nextUser.token);
    setUser(nextUser);

    return nextUser;
  };

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated: Boolean(token && user),
        isBootstrapping,
        login,
        logout,
        token,
        updateUser,
        user,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = (): AuthenticationContextValue => {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error("useAuthentication must be used within AuthenticationProvider.");
  }

  return context;
};
