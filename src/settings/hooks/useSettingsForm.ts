import { FormEvent, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { useAuthentication } from "../../authentication";
import { getAuthenticationErrorMessages } from "../../authentication/helpers/getAuthenticationErrorMessages";

const initialState = {
  bio: "",
  email: "",
  errorMessages: [] as string[],
  image: "",
  isSubmitting: false,
  password: "",
  username: "",
};

export const useSettingsForm = () => {
  const history = useHistory();
  const { updateUser, user } = useAuthentication();
  const [formValue, setFormValue] = useState(initialState);

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormValue((currentState) => ({
      ...currentState,
      bio: user.bio || "",
      email: user.email,
      image: user.image || "",
      password: "",
      username: user.username,
    }));
  }, [user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    setFormValue((currentState) => ({
      ...currentState,
      errorMessages: [],
      isSubmitting: true,
    }));

    try {
      const nextUser = await updateUser({
        bio: formValue.bio,
        email: formValue.email,
        image: formValue.image,
        ...(formValue.password ? { password: formValue.password } : {}),
        username: formValue.username,
      });

      history.push(`/profile/${nextUser.username}`);
    } catch (error) {
      setFormValue((currentState) => ({
        ...currentState,
        errorMessages: getAuthenticationErrorMessages(error),
        isSubmitting: false,
      }));
      return;
    }

    setFormValue((currentState) => ({
      ...currentState,
      isSubmitting: false,
      password: "",
    }));
  };

  return {
    bio: formValue.bio,
    email: formValue.email,
    errorMessages: formValue.errorMessages,
    handleSubmit,
    image: formValue.image,
    isSubmitting: formValue.isSubmitting,
    password: formValue.password,
    setBio: (bio: string) =>
      setFormValue((currentState) => ({
        ...currentState,
        bio,
      })),
    setEmail: (email: string) =>
      setFormValue((currentState) => ({
        ...currentState,
        email,
      })),
    setImage: (image: string) =>
      setFormValue((currentState) => ({
        ...currentState,
        image,
      })),
    setPassword: (password: string) =>
      setFormValue((currentState) => ({
        ...currentState,
        password,
      })),
    setUsername: (username: string) =>
      setFormValue((currentState) => ({
        ...currentState,
        username,
      })),
    username: formValue.username,
  };
};
