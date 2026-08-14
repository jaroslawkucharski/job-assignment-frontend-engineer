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

interface RequestOptions extends RequestInit {
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

export const getArticles = async (token?: UserData["token"] | null): Promise<Article[]> => {
  const payload = await request<ArticlesResponse>({
    path: "/articles",
    token,
  });

  return payload.articles;
};

export const favoriteArticle = async (slug: string, token: UserData["token"]): Promise<Article> => {
  const payload = await request<{ article: Article }>({
    method: "POST",
    path: `/articles/${slug}/favorite`,
    token,
  });

  return payload.article;
};

export const unfavoriteArticle = async (slug: string, token: UserData["token"]): Promise<Article> => {
  const payload = await request<{ article: Article }>({
    method: "DELETE",
    path: `/articles/${slug}/favorite`,
    token,
  });

  return payload.article;
};

export const formatArticleDate = (date: string): string =>
  new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const getAuthorImage = (image: string | null): string => image || FALLBACK_AVATAR;
