import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import AdminModel from "../models/Admin";

// POST /api/auth/login
export async function loginAdmin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "الرجاء إدخال البريد الإلكتروني وكلمة المرور" });
    }

    const admin = await AdminModel.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: "بيانات الدخول غير صحيحة" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "بيانات الدخول غير صحيحة" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not set in environment variables");
      return res.status(500).json({ message: "خطأ في إعدادات الخادم" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      secret,
      { expiresIn: "8h" }
    );

    return res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("loginAdmin error:", error);
    return res.status(500).json({ message: "تعذر تسجيل الدخول، حاول مجدداً" });
  }
}

// GET /api/auth/me  (verify current token is still valid + get admin info)
export async function getCurrentAdmin(req: Request, res: Response) {
  try {
    const adminId = (req as any).admin?.id;
    const admin = await AdminModel.findById(adminId);
    if (!admin) return res.status(404).json({ message: "الحساب غير موجود" });
    return res.json({ admin });
  } catch (error) {
    console.error("getCurrentAdmin error:", error);
    return res.status(500).json({ message: "تعذر جلب بيانات الحساب" });
  }
}
