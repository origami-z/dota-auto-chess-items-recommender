import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders title", () => {
  render(<App />);
  const titleElement = screen.getByText(/Dota Auto Chess Items/i);
  expect(titleElement).toBeInTheDocument();
});
