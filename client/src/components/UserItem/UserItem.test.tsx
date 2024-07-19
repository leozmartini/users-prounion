import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UserItem from "./UserItem";
import { User } from "../../models/User";
import { vi } from "vitest";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  Toaster: () => <div>Toaster</div>,
}));

vi.mock("../Modal/Modal", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => (
    <div>
      <div>{props.title}</div>
      <div>{props.description}</div>
      <button onClick={() => props.onConfirm("newName", "newEmail", "newPassword")}>
        {props.buttonText}
      </button>
      <button onClick={props.onClose}>Close</button>
    </div>
  ),
}));

vi.mock("../CustomButton/CustomButton", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => <button onClick={props.onClick}>{props.icon}</button>,
}));

const user: User = {
  id: 1,
  name: "Uset Test",
  email: "test@example.com",
};

const onUserDeleted = vi.fn();
const onUserUpdated = vi.fn();

describe("UserItem", () => {
  test("renders UserItem component", () => {
    render(
      <BrowserRouter>
        <UserItem {...user} onUserDeleted={onUserDeleted} onUserUpdated={onUserUpdated} />
      </BrowserRouter>
    );

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("edit")).toBeInTheDocument();
    expect(screen.getByText("trash")).toBeInTheDocument();
  });

  test("opens and closes update modal", () => {
    render(
      <BrowserRouter>
        <UserItem {...user} onUserDeleted={onUserDeleted} onUserUpdated={onUserUpdated} />
      </BrowserRouter>
    );

    const editButton = screen.getByText("edit");
    fireEvent.click(editButton);

    expect(screen.getByText("Atualizar usuário")).toBeInTheDocument();
    expect(screen.getByText("Insira apenas os dados que deseja atualizar:")).toBeInTheDocument();

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    expect(screen.queryByText("Atualizar usuário")).not.toBeInTheDocument();
  });

  test("opens and closes delete modal", () => {
    render(
      <BrowserRouter>
        <UserItem {...user} onUserDeleted={onUserDeleted} onUserUpdated={onUserUpdated} />
      </BrowserRouter>
    );

    const deleteButton = screen.getByText("trash");
    fireEvent.click(deleteButton);

    expect(screen.getByText("Confirmação de deleção")).toBeInTheDocument();
    expect(screen.getByText(`Tem certeza que deseja excluír "${user.name}" ?`)).toBeInTheDocument();

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    expect(screen.queryByText("Confirmação de deleção")).not.toBeInTheDocument();
  });
});
