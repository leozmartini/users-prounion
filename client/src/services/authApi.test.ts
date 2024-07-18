import MockAdapter from "axios-mock-adapter";
import { login } from "./authApi";
import api from "./apiConfig";

const mockAxios = new MockAdapter(api);

describe("login", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("should return the response data if login is successful", async () => {
    const email = "test@example.com";
    const password = "password";
    const responseData = { token: "valid-token" };

    mockAxios.onPost("/auth/login").reply(200, responseData);

    const result = await login(email, password);

    expect(result).toEqual(responseData);
  });

  it("should return the error message if login fails", async () => {
    const email = "test@example.com";
    const password = "password";
    const errorMessage = "Invalid credentials";

    mockAxios.onPost("/auth/login").reply(401, { message: errorMessage });

    const result = await login(email, password);

    expect(result).toEqual(errorMessage);
  });

  it("should return a generic error message if an unexpected error occurs", async () => {
    const email = "test@example.com";
    const password = "password";

    mockAxios.onPost("/auth/login").reply(500);

    const result = await login(email, password);

    expect(result).toEqual("Erro inesperado em nosso servidor.");
  });
});
