const STORAGE_KEY = "conduit.session";

export const readStoredToken = (): string | null => {
  const storedValue = window.localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as { token?: unknown };
    return typeof parsedValue.token === "string" ? parsedValue.token : null;
  } catch (error) {
    return null;
  }
};

export const storeSessionToken = (token: string): void => {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      token,
    })
  );
};

export const clearStoredToken = (): void => {
  window.localStorage.removeItem(STORAGE_KEY);
};
