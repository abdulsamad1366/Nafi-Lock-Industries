import { Router } from "express";
import { signup, login } from "../controllers/user-auth.controller";

const router = Router();

// Public User Authentication
router.post("/signup", signup);
router.post("/login", login);

export default router;
