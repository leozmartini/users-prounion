import { Request, Response } from "express";
import { login } from "../controllers/auth";
import { UserRepository } from "../repositories/userRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../repositories/userRepository");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("login function", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockJson: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {},
      app: {
        locals: {
          db: {},
        },
      },
    } as any;
    mockJson = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
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

  it("should return 400 if email or password are not provided", async () => {
    await login(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Email and password are required" });
  });

  it("should return 404 if user is not found", async () => {
    mockRequest.body = { email: "test@example.com", password: "password123" };
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await login(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return 401 if password is invalid", async () => {
    mockRequest.body = { email: "test@example.com", password: "password123" };
    mockUserRepository.findByEmail.mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      password: "pasword123",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await login(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Invalid password" });
  });

  it("should return a token if login is successful", async () => {
    mockRequest.body = { email: "test@example.com", password: "password123" };
    mockUserRepository.findByEmail.mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      password: "hashedPassword",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("token");

    await login(mockRequest as Request, mockResponse as Response);

    expect(mockJson).toHaveBeenCalledWith({ token: "token" });
  });

  it("should return 500 if there is an error", async () => {
    mockRequest.body = { email: "test@example.com", password: "password123" };
    mockUserRepository.findByEmail.mockRejectedValue(new Error("Database error"));

    await login(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
  });
});
