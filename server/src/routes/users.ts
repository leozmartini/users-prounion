import { Router } from "express";
import { createUser, getUserByID, getUsers } from "../controllers/users";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserByID);
router.post("/", createUser);

export default router;
