import { Router } from "express";
import { getUserByID, getUsers } from "../controllers/users";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserByID);

export default router;
