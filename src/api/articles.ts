import { UserData } from "../authentication/types";
import { API_URL } from "./config";

const FALLBACK_AVATAR = `${process.env.PUBLIC_URL || ""}/avatar-placeholder.svg`;

export interface ArticleAuthor {
  bio: string | null;
  following: boolean;
  image: string | null;
  username: string;
}

export interface Article {
  author: ArticleAuthor;
  body: string;
  createdAt: string;
  description: string;
  favorited: boolean;
  favoritesCount: number;
  slug: string;
  title: string;
  updatedAt: string;
}

interface ArticlesResponse {
  articles: Article[];
}

interface ArticleResponse {
  article: Article;
}

interface ProfileResponse {
  profile: ArticleAuthor;
}

interface RequestOptions extends RequestInit {
  token?: UserData["token"] | null;
}

interface GetArticlesOptions {
  author?: string;
  favorited?: string;
  token?: UserData["token"] | null;
}

const request = async <T,>({ path, token, ...options }: RequestOptions & { path: string }): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Token ${token}` } : {}),
      ...options.headers,
    },
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error("Articles request failed.");
  }

  return payload as T;
};

export const getArticles = async ({ author, favorited, token }: GetArticlesOptions = {}): Promise<Article[]> => {
  const searchParams = new URLSearchParams();

  if (author) {
    searchParams.set("author", author);
  }

  if (favorited) {
    searchParams.set("favorited", favorited);
  }

  const payload = await request<ArticlesResponse>({
    path: searchParams.size > 0 ? `/articles?${searchParams.toString()}` : "/articles",
    token,
  });

  return payload.articles;
};

export const getArticle = async (slug: string, token?: UserData["token"] | null): Promise<Article> => {
  const payload = await request<ArticleResponse>({
    path: `/articles/${slug}`,
    token,
  });

  return payload.article;
};

export const favoriteArticle = async (slug: string, token: UserData["token"]): Promise<Article> => {
  const payload = await request<ArticleResponse>({
    method: "POST",
    path: `/articles/${slug}/favorite`,
    token,
  });

  return payload.article;
};

export const unfavoriteArticle = async (slug: string, token: UserData["token"]): Promise<Article> => {
  const payload = await request<ArticleResponse>({
    method: "DELETE",
    path: `/articles/${slug}/favorite`,
    token,
  });

  return payload.article;
};

export const followAuthor = async (username: string, token: UserData["token"]): Promise<ArticleAuthor> => {
  const payload = await request<ProfileResponse>({
    method: "POST",
    path: `/profiles/${username}/follow`,
    token,
  });

  return payload.profile;
};

export const unfollowAuthor = async (username: string, token: UserData["token"]): Promise<ArticleAuthor> => {
  const payload = await request<ProfileResponse>({
    method: "DELETE",
    path: `/profiles/${username}/follow`,
    token,
  });

  return payload.profile;
};

export const getProfile = async (username: string, token?: UserData["token"] | null): Promise<ArticleAuthor> => {
  const payload = await request<ProfileResponse>({
    path: `/profiles/${username}`,
    token,
  });

  return payload.profile;
};

export const formatArticleDate = (date: string): string =>
  new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const getAuthorImage = (image: string | null): string => image || FALLBACK_AVATAR;
