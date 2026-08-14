import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import {
  Article,
  ArticleAuthor,
  favoriteArticle,
  followAuthor,
  getArticle,
  unfavoriteArticle,
  unfollowAuthor,
} from "../../api/articles";
import { useAuthentication } from "../../authentication";

const initialState = {
  article: null as Article | null,
  errorMessages: [] as string[],
  isFavoriteSubmitting: false,
  isFollowSubmitting: false,
  isLoading: true,
};

export const useArticlePage = () => {
  const history = useHistory();
  const { slug } = useParams<{ slug: string }>();
  const { token } = useAuthentication();
  const [state, setState] = useState(initialState);

  useEffect(() => {
    let isMounted = true;

    setState((currentState) => ({
      ...currentState,
      errorMessages: [],
      isLoading: true,
    }));

    getArticle(slug, token)
      .then((article) => {
        if (!isMounted) {
          return;
        }

        setState((currentState) => ({
          ...currentState,
          article,
          isLoading: false,
        }));
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setState((currentState) => ({
          ...currentState,
          article: null,
          errorMessages: ["Unable to load article."],
          isLoading: false,
        }));
      });

    return () => {
      isMounted = false;
    };
  }, [slug, token]);

  const handleFavoriteClick = async (): Promise<void> => {
    if (!state.article) {
      return;
    }

    if (!token) {
      history.push("/login");
      return;
    }

    setState((currentState) => ({
      ...currentState,
      isFavoriteSubmitting: true,
    }));

    try {
      const article = state.article.favorited
        ? await unfavoriteArticle(state.article.slug, token)
        : await favoriteArticle(state.article.slug, token);

      setState((currentState) => ({
        ...currentState,
        article,
        isFavoriteSubmitting: false,
      }));
    } catch (error) {
      setState((currentState) => ({
        ...currentState,
        errorMessages: ["Unable to update favorite article."],
        isFavoriteSubmitting: false,
      }));
    }
  };

  const handleFollowClick = async (): Promise<void> => {
    if (!state.article) {
      return;
    }

    if (!token) {
      history.push("/login");
      return;
    }

    setState((currentState) => ({
      ...currentState,
      isFollowSubmitting: true,
    }));

    try {
      const author = state.article.author.following
        ? await unfollowAuthor(state.article.author.username, token)
        : await followAuthor(state.article.author.username, token);

      setState((currentState) => ({
        ...currentState,
        article: currentState.article
          ? {
              ...currentState.article,
              author: author as ArticleAuthor,
            }
          : null,
        isFollowSubmitting: false,
      }));
    } catch (error) {
      setState((currentState) => ({
        ...currentState,
        errorMessages: ["Unable to update author follow status."],
        isFollowSubmitting: false,
      }));
    }
  };

  return {
    article: state.article,
    errorMessages: state.errorMessages,
    handleFavoriteClick,
    handleFollowClick,
    isFavoriteSubmitting: state.isFavoriteSubmitting,
    isFollowSubmitting: state.isFollowSubmitting,
    isLoading: state.isLoading,
  };
};
