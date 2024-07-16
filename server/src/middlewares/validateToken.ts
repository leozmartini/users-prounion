import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
require("dotenv").config();

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const secretKey = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secretKey);
    console.log(decoded);
    next();
  } catch (error) {
    res.status(401).json({ message: "Access denied. Invalid token." });
  }
};

export default validateToken;
