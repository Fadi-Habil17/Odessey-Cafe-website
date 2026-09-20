import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  slug: string;
  nameAr: string;
  nameEn: string;
  sortOrder: number;
}

const categorySchema = new Schema<ICategory>(
  {
    slug: { type: String, required: true, unique: true },
    nameAr: { type: String, required: true },
    nameEn: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model<ICategory>("Category", categorySchema);
