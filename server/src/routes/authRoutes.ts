import { Router } from "express";
import { loginAdmin, getCurrentAdmin } from "../controllers/authController";
import { requireAdminAuth } from "../middleware/authMiddleware";

const router = Router();

router.post("/login", loginAdmin);
router.get("/me", requireAdminAuth, getCurrentAdmin);

export default router;
