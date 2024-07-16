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
