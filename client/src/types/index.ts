// Shared TypeScript types for the Odessey café application

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  icon?: string;
  // Present when the API is called by the admin panel (same /categories
  // endpoint returns these extra fields too, harmless for public use)
  _id?: string;
  slug?: string;
  sortOrder?: number;
}

export interface MenuItem {
  _id: string;
  nameAr: string;
  nameEn?: string;
  descriptionAr: string;
  price: number;
  currency: string; // e.g. "ل.س" or "$"
  imageUrl: string;
  categoryId: string;
  isAvailable: boolean;
  isFeatured?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface WorkingHours {
  label: string; // e.g. "الدوام الصيفي"
  hours: string; // e.g. "9:00 ص - 2:00 ص"
}

// ── Admin-only types ──

export interface Admin {
  id: string;
  username: string;
  email: string;
  role: "admin" | "superadmin";
}

export interface LoginPayload {
  email: string;
  password: string;
}

// Category as returned/managed by the admin CRUD endpoints (has a real Mongo _id)
export interface AdminCategory {
  _id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  sortOrder: number;
}

// Shape used by the admin's add/edit item form
export interface MenuItemFormData {
  nameAr: string;
  nameEn?: string;
  descriptionAr: string;
  price: number;
  currency: string;
  categoryId: string;
  isAvailable: boolean;
  isFeatured: boolean;
  imageFile?: File | null;
  imageUrl?: string; // existing image, shown when editing
}
