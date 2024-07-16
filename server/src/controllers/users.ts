import { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";

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
    const user = await userRepository.create({ name, email, password });
    await userRepository.save(user);
    res.status(201).json(user);
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
