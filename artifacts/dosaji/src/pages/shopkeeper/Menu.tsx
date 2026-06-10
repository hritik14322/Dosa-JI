import { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";

interface MenuFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  isVeg: boolean;
  isAvailable: boolean;
}

const emptyForm: MenuFormData = {
  name: "",
  description: "",
  price: "",
  category: "Dosa",
  imageUrl: "",
  isVeg: true,
  isAvailable: true,
};

const CATEGORIES = ["Dosa", "Pizza", "Burger", "Rolls", "Beverages"];

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

  const handleToggle = (id: number, current: boolean) => {
    toggleMutation.mutate({ id, data: { isAvailable: !current } }, {
      onSuccess: () => {
        toast({ title: "Availability updated" });
        invalidate();
      },
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
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      category: form.category,
      imageUrl: form.imageUrl || undefined,
      isVeg: form.isVeg,
      isAvailable: form.isAvailable,
    };

    if (!payload.name || isNaN(payload.price) || payload.price <= 0) {
      toast({ title: "Validation error", description: "Name and a valid price are required.", variant: "destructive" });
      return;
    }

    if (editId !== null) {
      updateMutation.mutate({ id: editId, data: payload }, {
        onSuccess: () => {
          toast({ title: "Item updated successfully" });
          setDialogOpen(false);
          invalidate();
        },
        onError: (err: any) => {
          toast({ title: "Update failed", description: err.error || "Could not update item", variant: "destructive" });
        },
      });
    } else {
      createMutation.mutate({ data: payload }, {
        onSuccess: () => {
          toast({ title: "Item added successfully" });
          setDialogOpen(false);
          invalidate();
        },
        onError: (err: any) => {
          toast({ title: "Create failed", description: err.error || "Could not add item", variant: "destructive" });
        },
      });
    }
  };

  const handleDelete = () => {
    if (deleteId === null) return;
    deleteMutation.mutate({ id: deleteId }, {
      onSuccess: () => {
        toast({ title: "Item deleted" });
        setDeleteId(null);
        invalidate();
      },
      onError: (err: any) => {
        toast({ title: "Delete failed", description: err.error || "Could not delete item", variant: "destructive" });
      },
    });
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-serif">Manage Menu</h1>
        <Button onClick={openAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="p-4 font-semibold">Item</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold text-center w-24">Type</th>
                <th className="p-4 font-semibold text-right w-28">Price</th>
                <th className="p-4 font-semibold text-center w-36">Available</th>
                <th className="p-4 font-semibold text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems?.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                        {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{item.category}</td>
                  <td className="p-4 text-center">
                    <div className="inline-block p-1 bg-white rounded-sm shadow-sm border mx-auto">
                      <div className={`w-3 h-3 border-2 flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right font-medium">₹{item.price}</td>
                  <td className="p-4 text-center">
                    <Switch
                      checked={item.isAvailable}
                      onCheckedChange={() => handleToggle(item.id, item.isAvailable)}
                      disabled={toggleMutation.isPending}
                    />
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)} className="h-8 w-8">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {menuItems?.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-muted-foreground">
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId !== null ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="item-name">Name *</Label>
              <Input id="item-name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Masala Dosa" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-desc">Description</Label>
              <Textarea id="item-desc" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Short description of the item" rows={2} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-price">Price (₹) *</Label>
                <Input id="item-price" type="number" min="1" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="99" />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-image">Image URL</Label>
              <Input id="item-image" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
            </div>

            <div className="flex gap-6 pt-1">
              <div className="flex items-center gap-3">
                <Switch id="item-veg" checked={form.isVeg} onCheckedChange={v => setForm({ ...form, isVeg: v })} />
                <Label htmlFor="item-veg" className="cursor-pointer">{form.isVeg ? "🟢 Veg" : "🔴 Non-Veg"}</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch id="item-avail" checked={form.isAvailable} onCheckedChange={v => setForm({ ...form, isAvailable: v })} />
                <Label htmlFor="item-avail" className="cursor-pointer">{form.isAvailable ? "Available" : "Unavailable"}</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : editId !== null ? "Save Changes" : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete menu item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The item will be permanently removed from the menu.
            </AlertDialogDescription>
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
