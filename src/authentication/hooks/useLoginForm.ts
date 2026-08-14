import { FormEvent, useState } from "react";

import { useAuthentication } from "../context/AuthenticationContext";
import { getAuthenticationErrorMessages } from "../helpers/getAuthenticationErrorMessages";

const initialValue = {
  email: "",
  errorMessages: [] as string[],
  isSubmitting: false,
  password: "",
};

export const useLoginForm = () => {
  const { login } = useAuthentication();
  const [formValue, setFormValue] = useState(initialValue);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setFormValue((currentState) => ({
      ...currentState,
      errorMessages: [],
      isSubmitting: true,
    }));

    try {
      await login({ email: formValue.email, password: formValue.password });
    } catch (error) {
      setFormValue((currentState) => ({
        ...currentState,
        errorMessages: getAuthenticationErrorMessages(error),
      }));
    } finally {
      setFormValue((currentState) => ({
        ...currentState,
        isSubmitting: false,
      }));
    }
  };

  return {
    email: formValue.email,
    errorMessages: formValue.errorMessages,
    handleSubmit,
    isSubmitting: formValue.isSubmitting,
    password: formValue.password,
    setEmail: (email: string) =>
      setFormValue((currentState) => ({
        ...currentState,
        email,
      })),
    setPassword: (password: string) =>
      setFormValue((currentState) => ({
        ...currentState,
        password,
      })),
  };
};
