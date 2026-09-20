import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import AdminLayout from "../components/admin/AdminLayout";
import AdminItemsTable from "../components/admin/AdminItemsTable";
import ItemFormModal from "../components/admin/ItemFormModal";
import DeleteConfirmDialog from "../components/admin/DeleteConfirmDialog";
import CategoryManager from "../components/admin/CategoryManager";
import { fetchCategories, fetchMenuItems } from "../services/api";
import * as adminApi from "../services/api";
import type { Category, MenuItem, MenuItemFormData } from "../types";

type Tab = "items" | "categories";

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("items");

  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadData() {
    setIsLoading(true);
    try {
      const [itemsData, categoriesData] = await Promise.all([
        fetchMenuItems("all"),
        fetchCategories(),
      ]);
      setItems(itemsData);
      setCategories(categoriesData);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openAddForm() {
    setEditingItem(null);
    setIsFormOpen(true);
  }

  function openEditForm(item: MenuItem) {
    setEditingItem(item);
    setIsFormOpen(true);
  }

  async function handleFormSubmit(data: MenuItemFormData) {
    if (editingItem) {
      await adminApi.updateMenuItem(editingItem._id, data);
    } else {
      await adminApi.createMenuItem(data);
    }
    await loadData();
  }

  async function handleConfirmDelete() {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteMenuItem(deletingItem._id);
      setDeletingItem(null);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || "تعذر حذف الصنف");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AdminLayout title="إدارة الأصناف والأقسام">
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setTab("items")}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            tab === "items"
              ? "bg-wine-600 text-marble-50"
              : "bg-marble-50 border border-gold-200 text-aegean-700"
          }`}
        >
          الأصناف
        </button>
        <button
          onClick={() => setTab("categories")}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            tab === "categories"
              ? "bg-wine-600 text-marble-50"
              : "bg-marble-50 border border-gold-200 text-aegean-700"
          }`}
        >
          الأقسام
        </button>
      </div>

      {tab === "items" && (
        <>
          <div className="flex justify-end mb-3">
            <button
              onClick={openAddForm}
              className="flex items-center gap-1.5 bg-aegean-800 hover:bg-wine-600 text-marble-50 text-sm font-semibold px-4 py-2 rounded-full transition-colors"
            >
              <Plus size={16} />
              إضافة صنف جديد
            </button>
          </div>

          <AdminItemsTable
            items={items}
            categories={categories}
            isLoading={isLoading}
            onEdit={openEditForm}
            onDelete={setDeletingItem}
          />
        </>
      )}

      {tab === "categories" && (
        <CategoryManager
          categories={categories
            .filter((c): c is Category & { _id: string } => !!c._id)
            .map((c) => ({
              _id: c._id,
              slug: c.slug || c.id,
              nameAr: c.nameAr,
              nameEn: c.nameEn,
              sortOrder: c.sortOrder ?? 0,
            }))}
          onChanged={loadData}
        />
      )}

      <ItemFormModal
        isOpen={isFormOpen}
        categories={categories}
        editingItem={editingItem}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmDialog
        isOpen={!!deletingItem}
        itemName={deletingItem?.nameAr || ""}
        isDeleting={isDeleting}
        onCancel={() => setDeletingItem(null)}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
