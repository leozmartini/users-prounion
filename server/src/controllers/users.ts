import { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";
import { User } from "../entity/User";
import { validate } from "class-validator";
import bcrypt from "bcrypt";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userRepository.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await userRepository.findOneBy({ id });
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ name, email, password: hashedPassword });
    const errors = await validate(user);
    if (errors.length > 0) {
      const errorMessages = errors.map(error => {
        return Object.values(error.constraints || {}).join(", ");
      });
      return res.status(400).json({ messages: errorMessages[0] });
    }
    await userRepository.save(user);
    const userWithoutPassword: Partial<User> = { ...user };
    delete userWithoutPassword.password;
    res.status(201).json(userWithoutPassword);
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const user = await userRepository.findOneBy({ id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedFields: Partial<User> = {};

    if (name && name !== user.name) {
      user.name = name;
      updatedFields.name = name;
    }
    if (email && email !== user.email) {
      user.email = email;
      updatedFields.email = email;
    }
    if (password && password !== user.password) {
      user.password = password;
      updatedFields.password = password;
    }

    await userRepository.save(user);

    res.status(200).json(updatedFields);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await userRepository.findOneBy({ id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await userRepository.remove(user);
    res.status(204).json({ message: "User deleted." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
