import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import MockAdapter from "axios-mock-adapter";
import api from "./apiConfig";

describe("API Configuration", () => {
  let mock: MockAdapter;
  let alertMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mock = new MockAdapter(api);
    alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    mock.restore();
    alertMock.mockRestore();
  });

  it("should return response when the request is successful", async () => {
    const responseData = { message: "Success" };
    mock.onGet("/test").reply(200, responseData);

    const response = await api.get("/test");
    expect(response.data).toEqual(responseData);
  });

  it("should show an alert when a 500 error occurs", async () => {
    mock.onGet("/test").reply(500);

    try {
      await api.get("/test");
    } catch (error) {
      // Ignorar erro propositalmente
    }

    expect(alertMock).toHaveBeenCalledWith("Erro de conexão com nosso servidor.");
  });

  it("should reject the promise when an error occurs", async () => {
    mock.onGet("/test").reply(500);

    await expect(api.get("/test")).rejects.toThrow();
  });
});
