import { FormEvent, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { createArticle, getArticle, updateArticle } from "../../api/articles";
import { useAuthentication } from "../../authentication";
import { getAuthenticationErrorMessages } from "../../authentication/helpers/getAuthenticationErrorMessages";

const initialState = {
  body: "",
  description: "",
  errorMessages: [] as string[],
  isLoading: false,
  isSubmitting: false,
  tagListInput: "",
  title: "",
};

export const useEditorForm = () => {
  const history = useHistory();
  const { slug } = useParams<{ slug?: string }>();
  const { token } = useAuthentication();
  const [formValue, setFormValue] = useState(initialState);
  const isEditing = Boolean(slug);

  useEffect(() => {
    if (!slug || !token) {
      return;
    }

    let isMounted = true;

    setFormValue((currentState) => ({
      ...currentState,
      errorMessages: [],
      isLoading: true,
    }));

    getArticle(slug, token)
      .then((article) => {
        if (!isMounted) {
          return;
        }

        setFormValue((currentState) => ({
          ...currentState,
          body: article.body,
          description: article.description,
          isLoading: false,
          tagListInput: article.tagList?.join(", ") || "",
          title: article.title,
        }));
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        setFormValue((currentState) => ({
          ...currentState,
          errorMessages: getAuthenticationErrorMessages(error),
          isLoading: false,
        }));
      });

    return () => {
      isMounted = false;
    };
  }, [slug, token]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!token) {
      history.push("/login");
      return;
    }

    setFormValue((currentState) => ({
      ...currentState,
      errorMessages: [],
      isSubmitting: true,
    }));

    try {
      const articlePayload = {
        body: formValue.body,
        description: formValue.description,
        tagList: formValue.tagListInput
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        title: formValue.title,
      };

      const article = slug
        ? await updateArticle(slug, articlePayload, token)
        : await createArticle(articlePayload, token);

      history.push(`/${article.slug}`);
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
    }));
  };

  return {
    body: formValue.body,
    description: formValue.description,
    errorMessages: formValue.errorMessages,
    handleSubmit,
    isEditing,
    isLoading: formValue.isLoading,
    isSubmitting: formValue.isSubmitting,
    setBody: (body: string) =>
      setFormValue((currentState) => ({
        ...currentState,
        body,
      })),
    setDescription: (description: string) =>
      setFormValue((currentState) => ({
        ...currentState,
        description,
      })),
    setTagListInput: (tagListInput: string) =>
      setFormValue((currentState) => ({
        ...currentState,
        tagListInput,
      })),
    setTitle: (title: string) =>
      setFormValue((currentState) => ({
        ...currentState,
        title,
      })),
    tagList: formValue.tagListInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    tagListInput: formValue.tagListInput,
    title: formValue.title,
  };
};
