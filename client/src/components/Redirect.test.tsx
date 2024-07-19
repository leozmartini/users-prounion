import { render, waitFor } from "@testing-library/react";
import Redirect from "./Redirect";
import { vi } from "vitest";
import { parseCookies } from "nookies";
import { useNavigate } from "react-router-dom";

vi.mock("react-router-dom", async importOriginal => {
  const actual = await importOriginal();
  return {
    actual,
    useNavigate: vi.fn(),
  };
});

vi.mock("nookies", () => ({
  parseCookies: vi.fn(),
}));

describe("Redirect component", () => {
  it("should navigate to /home when token exists", async () => {
    const navigate = vi.fn();
    (useNavigate as unknown as jest.Mock).mockReturnValue(navigate);
    (parseCookies as unknown as jest.Mock).mockReturnValue({ token: "some-token" });

    render(<Redirect />);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/home");
    });
  });

  it("should navigate to /login when token does not exist", async () => {
    const navigate = vi.fn();
    (useNavigate as unknown as jest.Mock).mockReturnValue(navigate);
    (parseCookies as unknown as jest.Mock).mockReturnValue({});

    render(<Redirect />);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/login");
    });
  });
});
