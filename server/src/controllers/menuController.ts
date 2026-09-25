import { Request, Response } from "express";
import { isDbConnected } from "../config/db";
import MenuItemModel from "../models/MenuItem";
import CategoryModel from "../models/Category";
import { mockCategories, mockMenuItems } from "../data/mockData";
import type { AuthenticatedRequest } from "../middleware/authMiddleware";
import { uploadToCloudinary } from "../middleware/uploadMiddleware";

const useMock = () => process.env.USE_MOCK_DB === "true" || !isDbConnected();

// GET /api/categories
export async function getCategories(_req: Request, res: Response) {
  try {
    if (useMock()) {
      return res.json(mockCategories);
    }

    const categories = await CategoryModel.find().sort({ sortOrder: 1 });
    // `id` (slug) is used by the public site; `_id` + `slug` + `sortOrder`
    // are included too so the admin panel can edit/delete categories.
    const formatted = categories.map((c) => ({
      id: c.slug,
      _id: c._id,
      slug: c.slug,
      nameAr: c.nameAr,
      nameEn: c.nameEn,
      sortOrder: c.sortOrder,
    }));
    return res.json(formatted);
  } catch (error) {
    console.error("getCategories error:", error);
    return res.status(500).json({ message: "تعذر تحميل الأقسام" });
  }
}

// GET /api/menu?category=slug
export async function getMenuItems(req: Request, res: Response) {
  try {
    const { category } = req.query;

    if (useMock()) {
      let items = mockMenuItems;
      if (category && category !== "all") {
        items = items.filter((item) => item.categoryId === category);
      }
      return res.json(items);
    }

    const filter =
      category && category !== "all" ? { categoryId: category } : {};
    const items = await MenuItemModel.find(filter).sort({ isFeatured: -1 });
    return res.json(items);
  } catch (error) {
    console.error("getMenuItems error:", error);
    return res.status(500).json({ message: "تعذر تحميل قائمة الطعام" });
  }
}

// GET /api/menu/:id
export async function getMenuItemById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (useMock()) {
      const item = mockMenuItems.find((i) => i._id === id);
      if (!item) return res.status(404).json({ message: "الصنف غير موجود" });
      return res.json(item);
    }

    const item = await MenuItemModel.findById(id);
    if (!item) return res.status(404).json({ message: "الصنف غير موجود" });
    return res.json(item);
  } catch (error) {
    console.error("getMenuItemById error:", error);
    return res.status(500).json({ message: "تعذر تحميل الصنف" });
  }
}

// ─────────────────────────────────────────────────────────
// Admin-only endpoints below (protected by requireAdminAuth
// in menuRoutes.ts). These require a real MongoDB connection —
// they are not available while USE_MOCK_DB=true, since mock
// data lives only in memory and resets on every restart.
// ─────────────────────────────────────────────────────────

// POST /api/menu  (admin only)
export async function createMenuItem(req: AuthenticatedRequest, res: Response) {
  try {
    if (useMock()) {
      return res.status(400).json({
        message:
          "لا يمكن إضافة أصناف أثناء استخدام البيانات الوهمية (USE_MOCK_DB=true). فعّل MongoDB أولاً.",
      });
    }

    const {
      nameAr,
      nameEn,
      descriptionAr,
      price,
      currency,
      categoryId,
      isAvailable,
      isFeatured,
    } = req.body;

    if (!nameAr || !descriptionAr || !price || !categoryId) {
      return res
        .status(400)
        .json({
          message:
            "الرجاء تعبئة جميع الحقول المطلوبة (الاسم، الوصف، السعر، القسم)",
        });
    }

    let imageUrl = req.body.imageUrl || req.body.image || "";

    if (req.file) {
      try {
        imageUrl = await uploadToCloudinary(req.file);
      } catch (error) {
        console.error("Cloudinary upload failed:", error);
        return res
          .status(400)
          .json({ message: "فشل رفع الصورة، تأكد من إعدادات Cloudinary" });
      }
    }

    if (!imageUrl) {
      return res
        .status(400)
        .json({ message: "الرجاء رفع صورة أو إدخال رابط صورة" });
    }

    const item = await MenuItemModel.create({
      nameAr,
      nameEn,
      descriptionAr,
      price,
      currency: currency || "ل.س",
      imageUrl,
      categoryId,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      isFeatured: isFeatured || false,
    });

    return res.status(201).json(item);
  } catch (error) {
    console.error("createMenuItem error:", error);
    return res.status(500).json({ message: "تعذر إضافة الصنف" });
  }
}

// PUT /api/menu/:id  (admin only)
export async function updateMenuItem(req: AuthenticatedRequest, res: Response) {
  try {
    if (useMock()) {
      return res.status(400).json({
        message:
          "لا يمكن تعديل الأصناف أثناء استخدام البيانات الوهمية (USE_MOCK_DB=true). فعّل MongoDB أولاً.",
      });
    }

    const { id } = req.params;
    const updates: Record<string, unknown> = { ...req.body };

    if (req.file) {
      try {
        updates.imageUrl = await uploadToCloudinary(req.file);
      } catch (error) {
        console.error("Cloudinary update upload failed:", error);
        return res
          .status(400)
          .json({ message: "فشل تحديث الصورة، تأكد من إعدادات Cloudinary" });
      }
    }

    const item = await MenuItemModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ message: "الصنف غير موجود" });
    }

    return res.json(item);
  } catch (error) {
    console.error("updateMenuItem error:", error);
    return res.status(500).json({ message: "تعذر تعديل الصنف" });
  }
}

// DELETE /api/menu/:id  (admin only)
export async function deleteMenuItem(req: AuthenticatedRequest, res: Response) {
  try {
    if (useMock()) {
      return res.status(400).json({
        message:
          "لا يمكن حذف الأصناف أثناء استخدام البيانات الوهمية (USE_MOCK_DB=true). فعّل MongoDB أولاً.",
      });
    }

    const { id } = req.params;
    const item = await MenuItemModel.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({ message: "الصنف غير موجود" });
    }

    return res.json({ message: "تم حذف الصنف بنجاح" });
  } catch (error) {
    console.error("deleteMenuItem error:", error);
    return res.status(500).json({ message: "تعذر حذف الصنف" });
  }
}
