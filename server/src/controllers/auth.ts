import { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";
import jwt from "jsonwebtoken";
require("dotenv").config();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await userRepository.findOneBy({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({}, process.env.JWT_SECRET as string, {
      expiresIn: 120,
    });

    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
