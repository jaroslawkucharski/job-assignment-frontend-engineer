import React from "react";
import { render, screen } from "@testing-library/react";

import App from "./App";

beforeEach(() => {
  window.localStorage.clear();
  window.location.hash = "#/";
});

test("renders conduit link", () => {
  render(<App />);
  const linkElement = screen.getAllByText(/conduit/i)[0];
  expect(linkElement).toBeInTheDocument();
});

test("renders sign in page content", () => {
  window.location.hash = "#/login";
  render(<App />);
  expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /need an account/i })).toBeInTheDocument();
});
