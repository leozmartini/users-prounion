import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import validateToken from "../middlewares/validateToken";

jest.mock("jsonwebtoken");

describe("validateToken middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      cookies: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it("should return 401 if no token is provided", () => {
    validateToken(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Access denied. No token provided.",
    });
  });

  it("should call next if token is valid", () => {
    (mockRequest as Request).cookies!.token = "valid-token";
    (jwt.verify as jest.Mock).mockImplementation(() => {});

    validateToken(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", () => {
    mockRequest.cookies!.token = "invalid-token";
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    validateToken(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Access denied. Invalid token." });
  });
});
