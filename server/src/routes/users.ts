import { Router } from "express";
import { createUser, deleteUser, getUserByID, getUsers, updateUser } from "../controllers/users";
import validateToken from "../middlewares/validateToken";

const router = Router();

router.get("/", validateToken, getUsers);
router.get("/:id", validateToken, getUserByID);
router.post("/", validateToken, createUser);
router.put("/:id", validateToken, updateUser);
router.delete("/:id", validateToken, deleteUser);

export default router;
