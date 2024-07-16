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
