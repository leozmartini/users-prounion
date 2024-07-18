import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import UserTable from "./UserTable";
import { vi } from "vitest";
import { parseCookies, destroyCookie } from "nookies";
import { useNavigate } from "react-router-dom";
import { createUser, deleteUser, getAllUsers, updateUser } from "../../services/userApi";
import useUserList from "../../hooks/useUserList";

vi.mock("nookies", () => ({
  parseCookies: vi.fn(),
  destroyCookie: vi.fn(),
}));

vi.mock("react-router-dom", async importOriginal => {
  const actual = await importOriginal();
  return {
    actual,
    useNavigate: vi.fn(),
  };
});

vi.mock("../../services/userApi", () => ({
  createUser: vi.fn(),
  deleteUser: vi.fn(),
  getAllUsers: vi.fn(),
  updateUser: vi.fn(),
}));

vi.mock("../../hooks/useUserList", () => ({
  default: vi.fn(),
}));

vi.mock("../UserItem/UserItem", () => ({
  __esModule: true,
  default: ({
    id,
    name,
    email,
    onUserDeleted,
    onUserUpdated,
  }: {
    id: number;
    name: string;
    email: string;
    onUserDeleted: (id: number) => void;
    onUserUpdated: (id: number, email?: string, name?: string, password?: string) => void;
  }) => (
    <div data-testid={`user-${id}`}>
      <span>{name}</span>
      <span>{email}</span>
      <button data-testid={`delete-user-${id}`} onClick={() => onUserDeleted(id)}>
        Delete
      </button>
      <button
        data-testid={`update-user-${id}`}
        onClick={() => onUserUpdated(id, "newemail", "newname", "newpassword")}
      >
        Update
      </button>
    </div>
  ),
}));

vi.mock("../CustomButton/CustomButton", () => ({
  __esModule: true,
  default: ({
    onClick,
    text,
    color,
    icon,
  }: {
    onClick: () => void;
    text?: string;
    color: string;
    icon?: string;
  }) => (
    <button onClick={onClick} data-testid={`button-${text || icon}`} style={{ color }}>
      {text || icon}
    </button>
  ),
}));

vi.mock("../Modal/Modal", () => ({
  __esModule: true,
  default: ({
    title,
    description,
    buttonText,
    onConfirm,
  }: {
    title: string;
    description: string;
    buttonText: string;
    onConfirm: (input1Value?: string, input2Value?: string, input3Value?: string) => void;
  }) => (
    <div data-testid="modal">
      <h2>{title}</h2>
      <p>{description}</p>
      <button onClick={() => onConfirm("name", "email", "password")}>{buttonText}</button>
    </div>
  ),
}));

describe("UserTable component", () => {
  beforeEach(() => {
    (parseCookies as jest.Mock).mockReturnValue({ token: "some-token" });
    (useUserList as jest.Mock).mockReturnValue({
      users: [
        { id: 1, name: "User1", email: "user1@example.com" },
        { id: 2, name: "User2", email: "user2@example.com" },
      ],
      setUsers: vi.fn(),
    });
    (getAllUsers as jest.Mock).mockResolvedValue([
      { id: 1, name: "User1", email: "user1@example.com" },
      { id: 2, name: "User2", email: "user2@example.com" },
    ]);
  });

  it("should render users and buttons", async () => {
    render(<UserTable />);

    await waitFor(() => {
      expect(screen.getByTestId("user-1")).toBeInTheDocument();
      expect(screen.getByTestId("user-2")).toBeInTheDocument();
    });

    expect(screen.getByTestId("button-LogOut")).toBeInTheDocument();
    expect(screen.getByTestId("button-plus")).toBeInTheDocument();
  });

  it("should call onLogout and navigate to login", async () => {
    const navigate = vi.fn();
    (useNavigate as unknown as jest.Mock).mockReturnValue(navigate);

    render(<UserTable />);

    fireEvent.click(screen.getByTestId("button-LogOut"));

    await waitFor(() => {
      expect(destroyCookie).toHaveBeenCalledWith(null, "token");
      expect(navigate).toHaveBeenCalledWith("/login", {
        state: { message: "Sua sessão foi encerrada." },
      });
    });
  });

  it("should open and close the add user modal", async () => {
    render(<UserTable />);

    fireEvent.click(screen.getByTestId("button-plus"));

    expect(screen.getByTestId("modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cadastrar"));

    await waitFor(() => {
      expect(createUser).toHaveBeenCalledWith("name", "email", "password");
    });
  });

  it("should delete a user", async () => {
    render(<UserTable />);

    fireEvent.click(screen.getByTestId("delete-user-1"));

    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalledWith(1);
    });
  });

  it("should update a user", async () => {
    render(<UserTable />);

    fireEvent.click(screen.getByTestId("update-user-1"));

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith(1, "newemail", "newname", "newpassword");
    });
  });
});
