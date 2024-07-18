import { UserRepository } from "../repositories/userRepository";
import { User } from "../entity/User";
import { Connection } from "mysql2/promise";

describe("UserRepository", () => {
  let userRepository: UserRepository;
  let dbMock: Connection;

  beforeEach(() => {
    dbMock = {
      execute: jest.fn(),
    } as unknown as Connection;

    userRepository = new UserRepository(dbMock);
  });

  describe("findAll", () => {
    it("should return all users from the database", async () => {
      const expectedUsers: User[] = [
        { id: 1, name: "UserTeste", email: "test@example.com", password: "password" },
        { id: 2, name: "User2", email: "testess@example.com", password: "password" },
      ];

      (dbMock.execute as jest.Mock).mockResolvedValueOnce([expectedUsers]);

      const result = await userRepository.findAll();

      expect(dbMock.execute).toHaveBeenCalledWith("SELECT * FROM users", undefined);
      expect(result).toEqual(expectedUsers);
    });
  });

  describe("findById", () => {
    it("should return the user with the specified id from the database", async () => {
      const expectedUser: User = {
        id: 1,
        name: "UserTeste",
        email: "test@example.com",
        password: "password",
      };

      (dbMock.execute as jest.Mock).mockResolvedValueOnce([[expectedUser]]);

      const result = await userRepository.findById(1);

      expect(dbMock.execute).toHaveBeenCalledWith("SELECT * FROM users WHERE id = ?", [1]);
      expect(result).toEqual(expectedUser);
    });

    it("should return null if no user with the specified id is found", async () => {
      (dbMock.execute as jest.Mock).mockResolvedValueOnce([]);

      const result = await userRepository.findById(1);

      expect(dbMock.execute).toHaveBeenCalledWith("SELECT * FROM users WHERE id = ?", [1]);
      expect(result).toBeNull();
    });
  });

  // Add tests for other methods (findByEmail, create, update, delete) in a similar manner
});
