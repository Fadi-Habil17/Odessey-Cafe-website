import { Router } from "express";
import {
  getCategories,
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuController";
import { requireAdminAuth } from "../middleware/authMiddleware";
import { uploadImage } from "../middleware/uploadMiddleware";

const router = Router();

// ── Public routes (used by the regular café website) ──
router.get("/categories", getCategories);
router.get("/menu", getMenuItems);
router.get("/menu/:id", getMenuItemById);

// ── Admin-only routes (require a valid JWT token) ──
// uploadImage.single("image") parses the uploaded photo (field name: "image")
router.post("/menu", requireAdminAuth, uploadImage.single("image"), createMenuItem);
router.put("/menu/:id", requireAdminAuth, uploadImage.single("image"), updateMenuItem);
router.delete("/menu/:id", requireAdminAuth, deleteMenuItem);

export default router;
