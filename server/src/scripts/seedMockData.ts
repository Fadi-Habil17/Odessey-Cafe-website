import dotenv from "dotenv";
import mongoose from "mongoose";
import CategoryModel from "../models/Category";
import MenuItemModel from "../models/MenuItem";
import { mockCategories, mockMenuItems } from "../data/mockData";

dotenv.config();

async function seedMockData() {
  const { MONGO_URI } = process.env;

  if (!MONGO_URI) {
    console.error("❌ MONGO_URI غير موجود في ملف .env");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log("✅ متصل بقاعدة البيانات");

  await CategoryModel.deleteMany({});
  await MenuItemModel.deleteMany({});

  const categories = await CategoryModel.insertMany(
    mockCategories.map((category, index) => ({
      slug: category.id,
      nameAr: category.nameAr,
      nameEn: category.nameEn,
      sortOrder: index + 1,
    })),
  );

  const menuItems = mockMenuItems.map((item) => ({
    nameAr: item.nameAr,
    nameEn: item.nameEn || item.nameAr,
    descriptionAr: item.descriptionAr || "وصف غير متوفر في هذه اللحظة.",
    price: item.price,
    currency: item.currency,
    imageUrl:
      item.imageUrl ||
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
    categoryId: item.categoryId,
    isAvailable: item.isAvailable,
    isFeatured: item.isFeatured ?? false,
  }));

  await MenuItemModel.insertMany(menuItems);

  console.log(
    `🎉 تم إدخال ${categories.length} قسم و ${menuItems.length} منتج في MongoDB.`,
  );
  console.log(
    "📌 الآن الموقع سيعرض المنتجات من قاعدة البيانات بدل البيانات الوهمية.",
  );

  await mongoose.disconnect();
  process.exit(0);
}

seedMockData().catch((error) => {
  console.error("❌ فشل إدخال البيانات:", error);
  process.exit(1);
});
