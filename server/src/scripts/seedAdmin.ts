// One-time script to create the first admin account.
// Run with: npm run seed:admin
// Reads credentials from .env (ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD)
// so nothing sensitive is hardcoded in the source code.

import dotenv from "dotenv";
import mongoose from "mongoose";
import AdminModel from "../models/Admin";

dotenv.config();

async function seedAdmin() {
  const { MONGO_URI, ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!MONGO_URI) {
    console.error("❌ MONGO_URI غير موجود في ملف .env — لا يمكن الاتصال بقاعدة البيانات");
    process.exit(1);
  }

  if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error(
      "❌ الرجاء تعريف ADMIN_USERNAME و ADMIN_EMAIL و ADMIN_PASSWORD في ملف .env قبل تشغيل هذا السكربت"
    );
    process.exit(1);
  }

  if (ADMIN_PASSWORD.length < 6) {
    console.error("❌ كلمة مرور الأدمن يجب أن تكون 6 أحرف على الأقل");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log("✅ متصل بقاعدة البيانات");

  const existing = await AdminModel.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    console.log(`⚠️  يوجد أدمن مسبقاً بهذا البريد: ${ADMIN_EMAIL}`);
    console.log("   إذا نسيت كلمة المرور احذف الحساب من قاعدة البيانات وأعد تشغيل السكربت.");
    await mongoose.disconnect();
    process.exit(0);
  }

  const admin = new AdminModel({
    username: ADMIN_USERNAME,
    email: ADMIN_EMAIL.toLowerCase(),
    password: ADMIN_PASSWORD, // will be hashed automatically by the pre-save hook
    role: "superadmin",
  });

  await admin.save();

  console.log("🎉 تم إنشاء حساب الأدمن بنجاح!");
  console.log(`   البريد الإلكتروني: ${ADMIN_EMAIL}`);
  console.log("   يمكنك الآن تسجيل الدخول من صفحة /admin/login");
  console.log("   ⚠️  تذكّر حذف أو تغيير ADMIN_PASSWORD من .env بعد الانتهاء لأمان إضافي");

  await mongoose.disconnect();
  process.exit(0);
}

seedAdmin().catch((error) => {
  console.error("❌ فشل إنشاء حساب الأدمن:", error);
  process.exit(1);
});
