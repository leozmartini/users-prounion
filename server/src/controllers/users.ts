import { Request, Response } from "express";
import { UserRepository } from "../repositories/userRepository";
import { User } from "../entity/User";
import bcrypt from "bcrypt";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const userRepository = new UserRepository(req.app.locals.db);
    const users = await userRepository.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const userRepository = new UserRepository(req.app.locals.db);
    const user = await userRepository.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email and password are required." });
  }
  try {
    const userRepository = new UserRepository(req.app.locals.db);
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user: Omit<User, "id"> = { name, email, password: hashedPassword };
    await userRepository.create(user);
    res.status(201).json(user);
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const userRepository = new UserRepository(req.app.locals.db);
    const user = await userRepository.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedFields: Partial<User> = {};

    if (name && name !== user.name) {
      updatedFields.name = name;
    }
    if (email && email !== user.email) {
      updatedFields.email = email;
    }
    if (password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updatedFields.password = hashedPassword;
      }
    }

    await userRepository.update(id, updatedFields);

    res.status(200).json(updatedFields);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const userRepository = new UserRepository(req.app.locals.db);
    const user = await userRepository.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await userRepository.delete(id);
    res.status(204).json({ message: "User deleted." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
