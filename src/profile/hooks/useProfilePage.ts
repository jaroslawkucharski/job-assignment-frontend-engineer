import { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";

import { Article, ArticleAuthor, favoriteArticle, followAuthor, getArticles, getProfile, unfavoriteArticle, unfollowAuthor } from "../../api/articles";
import { useAuthentication } from "../../authentication";

const initialState = {
  articles: [] as Article[],
  errorMessages: [] as string[],
  favoriteSlug: "",
  isFollowSubmitting: false,
  isLoading: true,
  profile: null as ArticleAuthor | null,
};

export const useProfilePage = () => {
  const history = useHistory();
  const location = useLocation();
  const { username } = useParams<{ username: string }>();
  const { token } = useAuthentication();
  const [state, setState] = useState(initialState);
  const isFavoritesPage = location.pathname.endsWith("/favorites");

  useEffect(() => {
    let isMounted = true;

    setState((currentState) => ({
      ...currentState,
      errorMessages: [],
      isLoading: true,
    }));

    Promise.all([
      getProfile(username, token),
      getArticles({
        author: isFavoritesPage ? undefined : username,
        favorited: isFavoritesPage ? username : undefined,
        token,
      }),
    ])
      .then(([profile, articles]) => {
        if (!isMounted) {
          return;
        }

        setState((currentState) => ({
          ...currentState,
          articles,
          isLoading: false,
          profile,
        }));
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setState((currentState) => ({
          ...currentState,
          articles: [],
          errorMessages: ["Unable to load profile page."],
          isLoading: false,
          profile: null,
        }));
      });

    return () => {
      isMounted = false;
    };
  }, [isFavoritesPage, token, username]);

  const handleFavoriteClick = async (article: Article): Promise<void> => {
    if (!token) {
      history.push("/login");
      return;
    }

    setState((currentState) => ({
      ...currentState,
      favoriteSlug: article.slug,
    }));

    try {
      const nextArticle = article.favorited
        ? await unfavoriteArticle(article.slug, token)
        : await favoriteArticle(article.slug, token);

      setState((currentState) => ({
        ...currentState,
        articles: currentState.articles.map((currentArticle) =>
          currentArticle.slug === article.slug ? nextArticle : currentArticle
        ),
        favoriteSlug: "",
      }));
    } catch (error) {
      setState((currentState) => ({
        ...currentState,
        errorMessages: ["Unable to update favorite article."],
        favoriteSlug: "",
      }));
    }
  };

  const handleFollowClick = async (): Promise<void> => {
    if (!state.profile) {
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
      const profile = state.profile.following
        ? await unfollowAuthor(state.profile.username, token)
        : await followAuthor(state.profile.username, token);

      setState((currentState) => ({
        ...currentState,
        articles: currentState.articles.map((article) => ({
          ...article,
          author: article.author.username === profile.username ? profile : article.author,
        })),
        isFollowSubmitting: false,
        profile,
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
    articles: state.articles,
    errorMessages: state.errorMessages,
    favoriteSlug: state.favoriteSlug,
    handleFavoriteClick,
    handleFollowClick,
    isFavoritesPage,
    isFollowSubmitting: state.isFollowSubmitting,
    isLoading: state.isLoading,
    profile: state.profile,
    username,
  };
};
