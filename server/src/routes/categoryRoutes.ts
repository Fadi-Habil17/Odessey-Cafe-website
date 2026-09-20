import { Router } from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { requireAdminAuth } from "../middleware/authMiddleware";

const router = Router();

// All routes here require a valid admin token.
// Public GET /api/categories stays in menuRoutes.ts (unchanged).
router.post("/categories", requireAdminAuth, createCategory);
router.put("/categories/:id", requireAdminAuth, updateCategory);
router.delete("/categories/:id", requireAdminAuth, deleteCategory);

export default router;
