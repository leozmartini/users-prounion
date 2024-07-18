import { Request, Response } from "express";
import { getUsers, getUserByID, createUser, updateUser, deleteUser } from "../controllers/users";
import { UserRepository } from "../repositories/userRepository";
import bcrypt from "bcrypt";
import { User } from "../entity/User";

jest.mock("../repositories/userRepository");
jest.mock("bcrypt");

describe("User Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      app: {
        locals: {
          db: {},
        },
      } as any,
    };
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };
    mockUserRepository = new UserRepository(
      (mockRequest.app as any).locals.db
    ) as jest.Mocked<UserRepository>;
    (UserRepository as jest.Mock).mockReturnValue(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUsers", () => {
    it("should return 200 and all users", async () => {
      const users: User[] = [
        { id: 1, name: "UserTeste", email: "teste@example.com", password: "hashedPassword" },
      ];
      mockUserRepository.findAll.mockResolvedValue(users);

      await getUsers(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(users);
    });

    it("should return 500 if there is an error", async () => {
      mockUserRepository.findAll.mockRejectedValue(new Error("Database error"));

      await getUsers(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
    });
  });

  describe("getUserByID", () => {
    it("should return 200 and the user if found", async () => {
      const user: User = {
        id: 1,
        name: "UserTeste",
        email: "teste@example.com",
        password: "hashedPassword",
      };
      mockRequest.params = { id: "1" };
      mockUserRepository.findById.mockResolvedValue(user);

      await getUserByID(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(user);
    });

    it("should return 404 if the user is not found", async () => {
      mockRequest.params = { id: "1" };
      mockUserRepository.findById.mockResolvedValue(null);

      await getUserByID(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return 500 if there is an error", async () => {
      mockRequest.params = { id: "1" };
      mockUserRepository.findById.mockRejectedValue(new Error("Database error"));

      await getUserByID(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
    });
  });

  describe("createUser", () => {
    it("should return 400 if name, email or password are not provided", async () => {
      await createUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "name, email and password are required.",
      });
    });

    it("should return 409 if email is already in use", async () => {
      mockRequest.body = { name: "UserTeste", email: "teste@example.com", password: "password123" };
      mockUserRepository.findByEmail.mockResolvedValue({
        id: 1,
        name: "UserTeste",
        email: "teste@example.com",
        password: "hashedPassword",
      });

      await createUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Email already in use." });
    });

    it("should return 201 and create a user", async () => {
      mockRequest.body = { name: "UserTeste", email: "teste@example.com", password: "password123" };
      mockUserRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

      await createUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        name: "UserTeste",
        email: "teste@example.com",
        password: "hashedPassword",
      });
    });

    it("should return 500 if there is an error", async () => {
      mockRequest.body = { name: "UserTeste", email: "teste@example.com", password: "password123" };
      mockUserRepository.findByEmail.mockRejectedValue(new Error("Database error"));

      await createUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
    });
  });

  describe("updateUser", () => {
    it("should return 404 if the user is not found", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = { name: "UserTeste", email: "teste@example.com", password: "password123" };
      mockUserRepository.findById.mockResolvedValue(null);

      await updateUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return 200 and update the user name", async () => {
      const user = {
        id: 1,
        name: "UserTeste",
        email: "teste@example.com",
        password: "hashedPassword",
      };
      mockRequest.params = { id: "1" };
      mockRequest.body = {
        name: "UserTeste Updated",
        email: "teste@example.com",
        password: "password123",
      };
      mockUserRepository.findById.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPasswordUpdated");

      await updateUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        name: "UserTeste Updated",
      });
    });

    it("should return 500 if there is an error", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = {
        name: "UserTeste Updated",
        email: "teste@example.com",
        password: "password123",
      };
      mockUserRepository.findById.mockRejectedValue(new Error("Database error"));

      await updateUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
    });
  });

  describe("deleteUser", () => {
    it("should return 404 if the user is not found", async () => {
      mockRequest.params = { id: "1" };
      mockUserRepository.findById.mockResolvedValue(null);

      await deleteUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return 204 and delete the user", async () => {
      const user: User = {
        id: 1,
        name: "UserTeste",
        email: "teste@example.com",
        password: "hashedPassword",
      };
      mockRequest.params = { id: "1" };
      mockUserRepository.findById.mockResolvedValue(user);

      await deleteUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "User deleted." });
    });

    it("should return 500 if there is an error", async () => {
      mockRequest.params = { id: "1" };
      mockUserRepository.findById.mockRejectedValue(new Error("Database error"));

      await deleteUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
    });
  });
});
