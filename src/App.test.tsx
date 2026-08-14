import React from "react";
import { render, screen } from "@testing-library/react";

import App from "./App";

const mockFetch = jest.fn();

beforeEach(() => {
  global.fetch = mockFetch as unknown as typeof fetch;
  window.localStorage.clear();
  window.location.hash = "#/";
  mockFetch.mockResolvedValue({
    json: async () => ({
      articles: [
        {
          author: {
            bio: null,
            following: false,
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
        },
      ],
      user: {
        bio: null,
        email: "alice@example.com",
        image: null,
        token: "token",
        username: "alice",
      },
    }),
    ok: true,
  });
});

test("renders conduit link", async () => {
  render(<App />);
  const linkElement = (await screen.findAllByText(/conduit/i))[0];
  expect(linkElement).toBeInTheDocument();
});

test("renders sign in page content", () => {
  window.location.hash = "#/login";
  render(<App />);
  expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /need an account/i })).toBeInTheDocument();
});

test("renders article title and author on homepage", async () => {
  render(<App />);

  expect(await screen.findByRole("link", { name: /example article/i })).toBeInTheDocument();
  expect(screen.getByText("alice")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /3/i })).toBeInTheDocument();
});
