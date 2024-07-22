import { Request, Response } from "express";
import { UserRepository } from "../repositories/userRepository";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import { isValidEmail } from "../helpers/validateEmail";
import { isValidName } from "../helpers/validateName";

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
    const user = await userRepository.findById(Number(id));
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
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
  if (!isValidName(name)) return res.status(400).json({ message: "Nome inválido" });
  if (!isValidEmail(email)) return res.status(400).json({ message: "Email inválido" });
  try {
    const userRepository = new UserRepository(req.app.locals.db);
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Este email ja foi cadastrado" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user: Omit<User, "id"> = {
      name,
      email,
      password: "A senha foi salva em hash com sucesso.",
    };
    const id = await userRepository.create(user);
    res.status(201).json({ id, ...user });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (name && !isValidName(name)) return res.status(400).json({ message: "Nome inválido" });
  if (email && !isValidEmail(email)) return res.status(400).json({ message: "Email inválido" });
  try {
    const userRepository = new UserRepository(req.app.locals.db);
    const user = await userRepository.findById(Number(id));

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
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

      // Se ela não é valida, então é diferente da senha atual
      if (!isPasswordValid) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updatedFields.password = "Senha atualizada";
      }
    }

    await userRepository.update(Number(id), updatedFields);

    res.status(200).json(updatedFields);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const userRepository = new UserRepository(req.app.locals.db);
    const user = await userRepository.findById(Number(id));
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    await userRepository.delete(Number(id));
    res.status(204).json({ message: "Usuário deletado." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
