import React from "react";
import { render, screen } from "@testing-library/react";

import App from "./App";

const mockFetch = jest.fn();
const article = {
  author: {
    bio: null,
    following: false,
    followersCount: 7,
    image: "",
    username: "alice",
  },
  body: "Body",
  createdAt: "2026-08-14T09:20:29.217Z",
  description: "Example description",
  favorited: false,
  favoritesCount: 3,
  slug: "example-article",
  title: "Example article",
  updatedAt: "2026-08-14T09:20:29.217Z",
};

beforeEach(() => {
  global.fetch = mockFetch as unknown as typeof fetch;
  window.localStorage.clear();
  window.location.hash = "#/";
  mockFetch.mockImplementation(async (input) => {
    const url = String(input);

    if (url.endsWith("/articles/example-article")) {
      return {
        json: async () => ({
          article,
        }),
        ok: true,
      };
    }

    if (url.endsWith("/profiles/alice")) {
      return {
        json: async () => ({
          profile: article.author,
        }),
        ok: true,
      };
    }

    return {
      json: async () => ({
        articles: [article],
        user: {
          bio: null,
          email: "alice@example.com",
          image: null,
          token: "token",
          username: "alice",
        },
      }),
      ok: true,
    };
  });
});

test("renders article list on homepage", async () => {
  render(<App />);

  expect(await screen.findByRole("heading", { name: /conduit/i })).toBeInTheDocument();
  expect(await screen.findByRole("link", { name: /example article/i })).toBeInTheDocument();
  expect(screen.getByText("alice")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /3/i })).toBeInTheDocument();
});

test("renders article page content without comments", async () => {
  window.location.hash = "#/example-article";
  render(<App />);

  expect(await screen.findByRole("heading", { name: /example article/i })).toBeInTheDocument();
  expect(screen.getAllByText("alice")[0]).toBeInTheDocument();
  expect(screen.getByText("Body")).toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: /follow alice/i })).toHaveLength(2);
  expect(screen.getAllByText("(7)")).toHaveLength(2);
  expect(screen.getAllByRole("button", { name: /favorite article/i })).toHaveLength(2);
  expect(screen.queryByPlaceholderText(/write a comment/i)).not.toBeInTheDocument();
});

test("renders profile page with authored articles", async () => {
  window.location.hash = "#/profile/alice";
  render(<App />);

  expect(await screen.findByRole("heading", { name: /alice/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /follow alice/i })).toBeInTheDocument();
  expect(screen.getByText("(7)")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /my articles/i })).toHaveClass("active");
  expect(screen.getByRole("link", { name: /favorited articles/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /example article/i })).toBeInTheDocument();
});
