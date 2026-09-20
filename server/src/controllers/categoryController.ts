import { Response } from "express";
import CategoryModel from "../models/Category";
import type { AuthenticatedRequest } from "../middleware/authMiddleware";

// POST /api/categories  (admin only)
export async function createCategory(req: AuthenticatedRequest, res: Response) {
  try {
    const { slug, nameAr, nameEn, sortOrder } = req.body;

    if (!slug || !nameAr || !nameEn) {
      return res.status(400).json({ message: "الرجاء تعبئة جميع الحقول المطلوبة" });
    }

    const existing = await CategoryModel.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: "يوجد قسم بنفس المعرّف (slug) مسبقاً" });
    }

    const category = await CategoryModel.create({ slug, nameAr, nameEn, sortOrder });
    return res.status(201).json(category);
  } catch (error) {
    console.error("createCategory error:", error);
    return res.status(500).json({ message: "تعذر إنشاء القسم" });
  }
}

// PUT /api/categories/:id  (admin only)
export async function updateCategory(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ message: "القسم غير موجود" });
    }

    return res.json(category);
  } catch (error) {
    console.error("updateCategory error:", error);
    return res.status(500).json({ message: "تعذر تعديل القسم" });
  }
}

// DELETE /api/categories/:id  (admin only)
export async function deleteCategory(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "القسم غير موجود" });
    }

    return res.json({ message: "تم حذف القسم بنجاح" });
  } catch (error) {
    console.error("deleteCategory error:", error);
    return res.status(500).json({ message: "تعذر حذف القسم" });
  }
}
