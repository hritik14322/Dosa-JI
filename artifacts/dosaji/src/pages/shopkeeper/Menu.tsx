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
import { Pencil, Trash2, Plus, ChevronDown } from "lucide-react";

interface MenuFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  isVeg: boolean;
  isAvailable: boolean;
  sizes: string;
}

const emptyForm: MenuFormData = {
  name: "",
  description: "",
  price: "",
  category: "Dosa",
  imageUrl: "",
  isVeg: true,
  isAvailable: true,
  sizes: "",
};

const DEFAULT_CATEGORIES = ["Dosa", "Pizza", "Burger", "Rolls", "Beverages"];

const SIZES_PRESETS = [
  { label: "Small, Medium, Large", value: "Small,Medium,Large" },
  { label: "Half, Full", value: "Half,Full" },
  { label: "Regular, Large", value: "Regular,Large" },
  { label: "Mini, Regular, Large", value: "Mini,Regular,Large" },
];

function CategoryCombobox({ value, onChange, categories }: {
  value: string;
  onChange: (v: string) => void;
  categories: string[];
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

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
          ref={inputRef}
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

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getListMenuItemsQueryKey() });

  const existingCategories = Array.from(new Set(menuItems?.map((i) => i.category) ?? []));

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
      sizes: item.sizes || "",
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    const price = parseFloat(form.price);
    if (!form.name || isNaN(price) || price <= 0) {
      toast({ title: "Validation error", description: "Name and a valid price are required.", variant: "destructive" });
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      price,
      category: form.category,
      imageUrl: form.imageUrl || "",
      isVeg: form.isVeg,
      isAvailable: form.isAvailable,
      sizes: form.sizes || null,
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

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" /></div>;
  }

  return (
    <div className="px-4 py-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Menu</h1>
        <Button onClick={openAdd} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Item
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Item</th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Category</th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Sizes</th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">Type</th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Price</th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">Available</th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {menuItems?.map((item) => (
                <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{item.name}</div>
                        <div className="text-xs text-gray-400 line-clamp-1 max-w-[180px]">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{item.category}</td>
                  <td className="px-5 py-4">
                    {item.sizes ? (
                      <div className="flex flex-wrap gap-1">
                        {item.sizes.split(",").map((s) => s.trim()).filter(Boolean).map((s) => (
                          <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-600 font-medium">
                            {s}
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
                    <Switch
                      checked={item.isAvailable}
                      onCheckedChange={() => handleToggle(item.id, item.isAvailable)}
                      disabled={toggleMutation.isPending}
                    />
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
              ))}
              {menuItems?.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                    No menu items yet. Click "Add Item" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg bg-[#faf8f5]">
          <DialogHeader>
            <DialogTitle>{editId !== null ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="item-name">Name *</Label>
              <Input id="item-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Masala Dosa" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-desc">Description</Label>
              <Textarea id="item-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description of the item" rows={2} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-price">Price (₹) *</Label>
                <Input id="item-price" type="number" min="1" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="99" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <CategoryCombobox
                  value={form.category}
                  onChange={(v) => setForm({ ...form, category: v })}
                  categories={existingCategories}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-image">Image URL</Label>
              <Input id="item-image" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
            </div>

            {/* Sizes */}
            <div className="space-y-2">
              <Label htmlFor="item-sizes">Size Options <span className="text-gray-400 font-normal">(comma-separated)</span></Label>
              <Input
                id="item-sizes"
                value={form.sizes}
                onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                placeholder="e.g. Small, Medium, Large"
              />
              {/* Quick presets */}
              <div className="flex flex-wrap gap-1.5">
                {SIZES_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setForm({ ...form, sizes: p.value })}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
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

      {/* Delete Confirm */}
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
    </div>
  );
}
