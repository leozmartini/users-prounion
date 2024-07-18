import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import LoginForm from "./LoginForm";
import { login } from "../../services/authApi";
import { setCookie } from "nookies";

vi.mock("../../services/authApi", () => ({
  login: vi.fn(),
}));

vi.mock("nookies", () => ({
  parseCookies: vi.fn(() => ({})),
  setCookie: vi.fn(),
}));

describe("LoginForm", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should display an error message if email or password is missing", async () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText(/por favor, preencha todos os campos/i)).toBeInTheDocument();
  });

  it("should call login and setCookie on successful login", async () => {
    const mockLoginResponse = { token: "fake-token" };
    (login as jest.Mock).mockResolvedValue(mockLoginResponse);

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("test@test.com", "password");
      expect(setCookie).toHaveBeenCalledWith(null, "token", "fake-token", { path: "/" });
    });
  });
});
