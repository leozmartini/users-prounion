import { Router } from "express";
import { createUser, deleteUser, getUserByID, getUsers, updateUser } from "../controllers/users";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserByID);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
