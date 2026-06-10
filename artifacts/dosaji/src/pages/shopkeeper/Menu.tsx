import { useRef, useState } from "react";
import {
  useListMenuItems,
  useToggleMenuItemAvailability,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
  getListMenuItemsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, ChevronDown, Tag, X, Upload, Link, ImageIcon } from "lucide-react";

interface SizeRow { name: string; price: string }

interface MenuFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  isVeg: boolean;
  isAvailable: boolean;
  sizeRows: SizeRow[];
}

const emptyForm: MenuFormData = {
  name: "",
  description: "",
  price: "",
  category: "Dosa",
  imageUrl: "",
  isVeg: true,
  isAvailable: true,
  sizeRows: [],
};

const DEFAULT_CATEGORIES = ["Dosa", "Pizza", "Burger", "Rolls", "Beverages"];

function sizesToString(rows: SizeRow[]): string {
  return rows.filter(r => r.name.trim()).map(r => `${r.name.trim()}:${r.price || "0"}`).join(",");
}

function parseSizesString(s: string | null | undefined): SizeRow[] {
  if (!s) return [];
  return s.split(",").map(part => {
    const [name, price = ""] = part.split(":");
    return { name: name.trim(), price: price.trim() };
  });
}

function CategoryCombobox({ value, onChange, categories }: {
  value: string;
  onChange: (v: string) => void;
  categories: string[];
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(value);

  const allOptions = Array.from(new Set([...DEFAULT_CATEGORIES, ...categories]));
  const filtered = allOptions.filter((c) => c.toLowerCase().includes(input.toLowerCase()));

  const select = (v: string) => {
    setInput(v);
    onChange(v);
    setOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          value={input}
          onChange={(e) => { setInput(e.target.value); onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="e.g. Dosa"
        />
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-xl border shadow-lg overflow-hidden">
          {filtered.map((c) => (
            <button
              key={c}
              type="button"
              onMouseDown={() => select(c)}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-amber-50 transition-colors flex items-center justify-between ${
                value === c ? "text-amber-600 font-semibold" : "text-gray-700"
              }`}
            >
              {c}
              {value === c && <span className="text-amber-500">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ImageInput({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [tab, setTab] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const token = sessionStorage.getItem("token");
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setTab("url")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            tab === "url" ? "bg-white shadow text-gray-800" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Link className="w-3.5 h-3.5" /> URL
        </button>
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            tab === "upload" ? "bg-white shadow text-gray-800" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Upload className="w-3.5 h-3.5" /> Upload
        </button>
      </div>

      {tab === "url" ? (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-amber-200 rounded-xl p-6 text-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/50 transition-colors"
        >
          {uploading ? (
            <div className="flex items-center justify-center gap-2 text-amber-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500" />
              <span className="text-sm">Uploading…</span>
            </div>
          ) : value ? (
            <div className="flex flex-col items-center gap-2">
              <img src={value} alt="preview" className="h-20 object-contain rounded-lg" />
              <span className="text-xs text-green-600 font-medium">✓ Uploaded — click to replace</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <ImageIcon className="w-8 h-8" />
              <span className="text-sm">Click to upload (max 5 MB)</span>
              <span className="text-xs">JPG, PNG, WebP, GIF</span>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {value && (
        <div className="flex items-center gap-2">
          <img src={value} alt="preview" className="w-10 h-10 rounded-lg object-cover border" />
          <span className="text-xs text-gray-500 truncate flex-1">{value}</span>
          <button type="button" onClick={() => onChange("")} className="text-gray-400 hover:text-red-500">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function ShopkeeperMenu() {
  const { data: menuItems, isLoading } = useListMenuItems();
  const toggleMutation = useToggleMenuItemAvailability();
  const createMutation = useCreateMenuItem();
  const updateMutation = useUpdateMenuItem();
  const deleteMutation = useDeleteMenuItem();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<MenuFormData>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteCategoryName, setDeleteCategoryName] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getListMenuItemsQueryKey() });

  const categoryStats = (menuItems ?? []).reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + 1;
    return acc;
  }, {});
  const existingCategories = Object.keys(categoryStats);

  const handleToggle = (id: number, current: boolean) => {
    toggleMutation.mutate({ id, data: { isAvailable: !current } }, {
      onSuccess: () => { toast({ title: "Availability updated" }); invalidate(); },
    });
  };

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (item: any) => {
    setEditId(item.id);
    setForm({
      name: item.name,
      description: item.description || "",
      price: String(item.price),
      category: item.category,
      imageUrl: item.imageUrl || "",
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      sizeRows: parseSizesString(item.sizes),
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    const price = parseFloat(form.price);
    if (!form.name || isNaN(price) || price <= 0) {
      toast({ title: "Validation error", description: "Name and a valid price are required.", variant: "destructive" });
      return;
    }

    const sizesStr = sizesToString(form.sizeRows);

    const payload = {
      name: form.name,
      description: form.description,
      price,
      category: form.category,
      imageUrl: form.imageUrl || "",
      isVeg: form.isVeg,
      isAvailable: form.isAvailable,
      sizes: sizesStr || null,
    };

    if (editId !== null) {
      updateMutation.mutate({ id: editId, data: payload }, {
        onSuccess: () => { toast({ title: "Item updated" }); setDialogOpen(false); invalidate(); },
        onError: (err: any) => { toast({ title: "Update failed", description: err.error, variant: "destructive" }); },
      });
    } else {
      createMutation.mutate({ data: payload }, {
        onSuccess: () => { toast({ title: "Item added" }); setDialogOpen(false); invalidate(); },
        onError: (err: any) => { toast({ title: "Create failed", description: err.error, variant: "destructive" }); },
      });
    }
  };

  const handleDelete = () => {
    if (deleteId === null) return;
    deleteMutation.mutate({ id: deleteId }, {
      onSuccess: () => { toast({ title: "Item deleted" }); setDeleteId(null); invalidate(); },
      onError: (err: any) => { toast({ title: "Delete failed", description: err.error, variant: "destructive" }); },
    });
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryName) return;
    const items = (menuItems ?? []).filter((i) => i.category === deleteCategoryName);
    setDeletingCategory(true);
    try {
      for (const item of items) {
        await deleteMutation.mutateAsync({ id: item.id });
      }
      toast({ title: `Category "${deleteCategoryName}" deleted`, description: `${items.length} item(s) removed.` });
      invalidate();
    } catch {
      toast({ title: "Some items could not be deleted", variant: "destructive" });
    } finally {
      setDeletingCategory(false);
      setDeleteCategoryName(null);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const addSizeRow = () => setForm(f => ({ ...f, sizeRows: [...f.sizeRows, { name: "", price: "" }] }));
  const removeSizeRow = (idx: number) => setForm(f => ({ ...f, sizeRows: f.sizeRows.filter((_, i) => i !== idx) }));
  const updateSizeRow = (idx: number, field: keyof SizeRow, value: string) => {
    setForm(f => ({ ...f, sizeRows: f.sizeRows.map((r, i) => i === idx ? { ...r, [field]: value } : r) }));
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" /></div>;
  }

  return (
    <div className="px-4 py-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Menu</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowCategories(!showCategories)}
            className="border-amber-300 text-amber-700 hover:bg-amber-50 flex items-center gap-2"
          >
            <Tag className="w-4 h-4" />
            Categories
          </Button>
          <Button onClick={openAdd} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Item
          </Button>
        </div>
      </div>

      {showCategories && (
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5 mb-6">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">All Categories</h2>
          {existingCategories.length === 0 ? (
            <p className="text-gray-400 text-sm">No categories yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {existingCategories.sort().map((cat) => (
                <div key={cat} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
                  <span className="text-sm font-medium text-amber-800">{cat}</span>
                  <span className="text-xs text-amber-500">{categoryStats[cat]} item{categoryStats[cat] !== 1 ? "s" : ""}</span>
                  <button onClick={() => setDeleteCategoryName(cat)} className="text-gray-400 hover:text-red-500 transition-colors ml-1" title={`Delete all items in "${cat}"`}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-400 mt-3">Deleting a category removes all menu items within it.</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Item</th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Category</th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Sizes & Prices</th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">Type</th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Base Price</th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">Available</th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {menuItems?.map((item) => {
                const sizes = parseSizesString(item.sizes);
                return (
                  <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl">
                          {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : "🍽️"}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{item.name}</div>
                          <div className="text-xs text-gray-400 line-clamp-1 max-w-[180px]">{item.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{item.category}</td>
                    <td className="px-5 py-4">
                      {sizes.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {sizes.map((s) => (
                            <span key={s.name} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-600 font-medium whitespace-nowrap">
                              {s.name}{s.price && s.price !== "0" ? ` ₹${s.price}` : ""}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="inline-block p-1 bg-white rounded-sm shadow-sm border mx-auto">
                        <div className={`w-3 h-3 border-2 flex items-center justify-center ${item.isVeg ? "border-green-600" : "border-red-600"}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? "bg-green-600" : "bg-red-600"}`} />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-amber-600">₹{item.price}</td>
                    <td className="px-5 py-4 text-center">
                      <Switch checked={item.isAvailable} onCheckedChange={() => handleToggle(item.id, item.isAvailable)} disabled={toggleMutation.isPending} />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(item)} className="h-8 w-8 text-gray-400 hover:text-amber-600 hover:bg-amber-50">
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)} className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {menuItems?.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400">No menu items yet. Click "Add Item" to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg bg-[#faf8f5] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId !== null ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Masala Dosa" />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description of the item" rows={2} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Base Price (₹) *</Label>
                <Input type="number" min="1" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="99" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <CategoryCombobox value={form.category} onChange={(v) => setForm({ ...form, category: v })} categories={existingCategories} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Image</Label>
              <ImageInput value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Size Options</Label>
                <button type="button" onClick={addSizeRow} className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Size
                </button>
              </div>
              {form.sizeRows.length === 0 ? (
                <p className="text-xs text-gray-400 py-1">No sizes — item sold at base price only. Click "Add Size" to offer multiple sizes.</p>
              ) : (
                <div className="space-y-2">
                  {form.sizeRows.map((row, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <Input
                        placeholder="Size name (e.g. Small)"
                        value={row.name}
                        onChange={(e) => updateSizeRow(idx, "name", e.target.value)}
                        className="flex-1"
                      />
                      <div className="relative w-28 flex-shrink-0">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="Price"
                          value={row.price}
                          onChange={(e) => updateSizeRow(idx, "price", e.target.value)}
                          className="pl-7"
                        />
                      </div>
                      <button type="button" onClick={() => removeSizeRow(idx)} className="text-gray-400 hover:text-red-500 flex-shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-6 pt-1">
              <div className="flex items-center gap-3">
                <Switch id="item-veg" checked={form.isVeg} onCheckedChange={(v) => setForm({ ...form, isVeg: v })} />
                <Label htmlFor="item-veg" className="cursor-pointer">
                  <span className={form.isVeg ? "text-green-600" : "text-red-500"}>
                    {form.isVeg ? "🟢 Veg" : "🔴 Non-Veg"}
                  </span>
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch id="item-avail" checked={form.isAvailable} onCheckedChange={(v) => setForm({ ...form, isAvailable: v })} />
                <Label htmlFor="item-avail" className="cursor-pointer">{form.isAvailable ? "Available" : "Unavailable"}</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-amber-500 hover:bg-amber-600 text-white">
              {isSaving ? "Saving..." : editId !== null ? "Save Changes" : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete menu item?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone. The item will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteCategoryName !== null} onOpenChange={(open) => { if (!open) setDeleteCategoryName(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category "{deleteCategoryName}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all{" "}
              <strong>{deleteCategoryName ? (categoryStats[deleteCategoryName] ?? 0) : 0}</strong>{" "}
              item(s) in this category. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingCategory}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={deletingCategory}>
              {deletingCategory ? "Deleting…" : "Delete All Items"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
