import { Schema, model, Document } from "mongoose";

export interface IMenuItem extends Document {
  nameAr: string;
  nameEn?: string;
  descriptionAr: string;
  price: number;
  currency: string;
  imageUrl: string;
  categoryId: string; // category slug
  isAvailable: boolean;
  isFeatured: boolean;
}

const menuItemSchema = new Schema<IMenuItem>(
  {
    nameAr: { type: String, required: true },
    nameEn: { type: String },
    descriptionAr: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "ل.س" },
    imageUrl: { type: String, required: true },
    categoryId: { type: String, required: true, index: true },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<IMenuItem>("MenuItem", menuItemSchema);
