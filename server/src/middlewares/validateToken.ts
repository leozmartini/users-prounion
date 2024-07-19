import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Acesso negado. Token não encontrado." });
  }

  try {
    const secretKey = process.env.JWT_SECRET as string;
    jwt.verify(token, secretKey);
    next();
  } catch (error) {
    res.status(401).json({ message: "Acesso negado. Token expirado." });
  }
};

export default validateToken;
