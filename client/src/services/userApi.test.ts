import { describe, it, expect, beforeEach, afterEach } from "vitest";
import MockAdapter from "axios-mock-adapter";
import api from "./apiConfig"; // Certifique-se de importar corretamente a configuração do axios
import { getAllUsers, createUser, deleteUser, updateUser } from "./userApi";

describe("API functions", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  afterEach(() => {
    mock.restore();
  });

  it("should get all users", async () => {
    const users = [{ id: 1, name: "UserTest ", email: "UserTest@example.com" }];
    mock.onGet("/users").reply(200, users);

    const response = await getAllUsers();
    expect(response).toEqual(users);
  });

  it("should create a new user", async () => {
    const newUser = { id: 2, name: "Teste ", email: "Teste@example.com" };
    mock.onPost("/users").reply(201, newUser);

    const response = await createUser("Teste ", "Teste@example.com", "password");
    expect(response).toEqual(newUser);
  });

  it("should delete a user", async () => {
    const userId = 1;
    mock.onDelete(`/users/${userId}`).reply(200, { success: true });

    const response = await deleteUser(userId);
    expect(response).toEqual({ success: true });
  });

  it("should update a user", async () => {
    const userId = 1;
    const updatedUser = { id: 1, name: "UserTest Updated", email: "UserTest_updated@example.com" };
    mock.onPut(`/users/${userId}`).reply(200, updatedUser);

    const response = await updateUser(
      userId,
      "UserTest Updated",
      "UserTest_updated@example.com",
      "newpassword"
    );
    expect(response).toEqual(updatedUser);
  });

  it("should throw an error if API call fails", async () => {
    mock.onGet("/users").reply(500);

    try {
      await getAllUsers();
    } catch (error: unknown) {
      expect(error as Error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe("Erro inesperado");
    }
  });
});
