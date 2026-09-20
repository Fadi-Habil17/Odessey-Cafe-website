import axios from "axios";
import type {
  Admin,
  AdminCategory,
  Category,
  LoginPayload,
  MenuItem,
  MenuItemFormData,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "odessey_admin_token";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach the admin's JWT token (if present) to every outgoing request.
// Public/customer-facing requests simply have no token and are unaffected.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Public (customer-facing) endpoints ──

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>("/categories");
  return data;
}

export async function fetchMenuItems(categoryId?: string): Promise<MenuItem[]> {
  const { data } = await api.get<MenuItem[]>("/menu", {
    params: categoryId && categoryId !== "all" ? { category: categoryId } : {},
  });
  return data;
}

// ── Admin auth ──

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function loginAdmin(payload: LoginPayload): Promise<{ token: string; admin: Admin }> {
  const { data } = await api.post<{ token: string; admin: Admin }>("/auth/login", payload);
  return data;
}

export async function fetchCurrentAdmin(): Promise<Admin> {
  const { data } = await api.get<{ admin: Admin }>("/auth/me");
  return data.admin;
}

// ── Admin menu-item CRUD ──
// Uses multipart/form-data so an image file can be uploaded together with the item's data.

function buildMenuItemFormData(item: MenuItemFormData): FormData {
  const formData = new FormData();
  formData.append("nameAr", item.nameAr);
  if (item.nameEn) formData.append("nameEn", item.nameEn);
  formData.append("descriptionAr", item.descriptionAr);
  formData.append("price", String(item.price));
  formData.append("currency", item.currency);
  formData.append("categoryId", item.categoryId);
  formData.append("isAvailable", String(item.isAvailable));
  formData.append("isFeatured", String(item.isFeatured));
  if (item.imageFile) {
    formData.append("image", item.imageFile);
  } else if (item.imageUrl) {
    formData.append("imageUrl", item.imageUrl);
  }
  return formData;
}

export async function createMenuItem(item: MenuItemFormData): Promise<MenuItem> {
  const { data } = await api.post<MenuItem>("/menu", buildMenuItemFormData(item), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateMenuItem(id: string, item: MenuItemFormData): Promise<MenuItem> {
  const { data } = await api.put<MenuItem>(`/menu/${id}`, buildMenuItemFormData(item), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteMenuItem(id: string): Promise<void> {
  await api.delete(`/menu/${id}`);
}

// ── Admin category CRUD ──

export async function createCategory(category: Omit<AdminCategory, "_id">): Promise<AdminCategory> {
  const { data } = await api.post<AdminCategory>("/categories", category);
  return data;
}

export async function updateCategory(id: string, category: Partial<AdminCategory>): Promise<AdminCategory> {
  const { data } = await api.put<AdminCategory>(`/categories/${id}`, category);
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/categories/${id}`);
}
