import { Router } from "express";
import { signup , verifyEmail, login, logout} from "../controllers/auth.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/login", login);

router.post("/logout", verifyJWT, logout);

export default router;
