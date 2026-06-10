import { useListCoupons, useCreateCoupon, useDeleteCoupon, getListCouponsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";

export default function AdminCoupons() {
  const { data: coupons, isLoading } = useListCoupons();
  const createMutation = useCreateCoupon();
  const deleteMutation = useDeleteCoupon();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percent" as "percent" | "flat",
    value: 10,
    minOrder: 0,
    maxUses: 100,
    expiresAt: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ data: formData }, {
      onSuccess: () => {
        toast({ title: "Coupon created" });
        setOpen(false);
        setFormData({ code: "", discountType: "percent", value: 10, minOrder: 0, maxUses: 100, expiresAt: "" });
        queryClient.invalidateQueries({ queryKey: getListCouponsQueryKey() });
      },
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this coupon?")) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Coupon deleted" });
        queryClient.invalidateQueries({ queryKey: getListCouponsQueryKey() });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Coupon Management</h1>
        <Button
          onClick={() => setOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Coupon
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Code</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Type</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Value</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Min Order</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Uses</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">Active</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {coupons?.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    No coupons yet. Create one to get started.
                  </td>
                </tr>
              )}
              {coupons?.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-sm px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg">
                      {coupon.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{coupon.discountType}</td>
                  <td className="px-6 py-4 text-sm font-bold text-amber-500">
                    {coupon.discountType === "percent" ? `${coupon.value}%` : `₹${coupon.value}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">₹{coupon.minOrder}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{coupon.usedCount} / {coupon.maxUses}</td>
                  <td className="px-6 py-4 text-center">
                    <Switch checked={coupon.usedCount < coupon.maxUses} disabled />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Coupon</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Code</Label>
              <Input
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. WELCOME20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(v: "percent" | "flat") => setFormData({ ...formData, discountType: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Percent (%)</SelectItem>
                    <SelectItem value="flat">Flat (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <Input
                  type="number" required min={1}
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min Order (₹)</Label>
                <Input
                  type="number" required min={0}
                  value={formData.minOrder}
                  onChange={(e) => setFormData({ ...formData, minOrder: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Max Uses</Label>
                <Input
                  type="number" required min={1}
                  value={formData.maxUses}
                  onChange={(e) => setFormData({ ...formData, maxUses: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Expiry Date (optional)</Label>
              <Input
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold mt-2"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Create Coupon"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
