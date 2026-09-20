import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  admin?: { id: string; role: string };
}

export function requireAdminAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "يجب تسجيل الدخول للوصول لهذه الخاصية" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not set in environment variables");
      return res.status(500).json({ message: "خطأ في إعدادات الخادم" });
    }

    const decoded = jwt.verify(token, secret) as { id: string; role: string };
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "جلسة الدخول غير صالحة أو منتهية، الرجاء تسجيل الدخول مجدداً" });
  }
}
