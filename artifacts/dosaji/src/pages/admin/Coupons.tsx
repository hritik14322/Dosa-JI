import { useListCoupons, useCreateCoupon, useDeleteCoupon, getListCouponsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

export default function AdminCoupons() {
  const { data: coupons, isLoading } = useListCoupons();
  const createMutation = useCreateCoupon();
  const deleteMutation = useDeleteCoupon();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percent" as any,
    value: 10,
    minOrder: 0,
    maxUses: 100
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ data: formData }, {
      onSuccess: () => {
        toast({ title: "Coupon created", description: "New coupon has been added." });
        setOpen(false);
        setFormData({ code: "", discountType: "percent", value: 10, minOrder: 0, maxUses: 100 });
        queryClient.invalidateQueries({ queryKey: getListCouponsQueryKey() });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Coupon deleted", description: "Coupon removed successfully." });
          queryClient.invalidateQueries({ queryKey: getListCouponsQueryKey() });
        }
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-serif">Coupons</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Coupon</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Code</Label>
                <Input required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="E.g. WELCOME10" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <Select value={formData.discountType} onValueChange={(v: any) => setFormData({...formData, discountType: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">Percentage (%)</SelectItem>
                      <SelectItem value="flat">Flat Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Value</Label>
                  <Input type="number" required min={1} value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Min Order Amount (₹)</Label>
                  <Input type="number" required min={0} value={formData.minOrder} onChange={e => setFormData({...formData, minOrder: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>Max Uses</Label>
                  <Input type="number" required min={1} value={formData.maxUses} onChange={e => setFormData({...formData, maxUses: Number(e.target.value)})} />
                </div>
              </div>
              <Button type="submit" className="w-full mt-4" disabled={createMutation.isPending}>Create Coupon</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="p-4 font-semibold">Code</th>
              <th className="p-4 font-semibold">Discount</th>
              <th className="p-4 font-semibold text-right">Min Order</th>
              <th className="p-4 font-semibold text-center">Uses</th>
              <th className="p-4 font-semibold text-right w-16">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons?.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No coupons found.</td></tr>
            )}
            {coupons?.map((coupon) => (
              <tr key={coupon.id} className="border-b last:border-0">
                <td className="p-4 font-bold font-mono">{coupon.code}</td>
                <td className="p-4">
                  {coupon.discountType === "percent" ? `${coupon.value}%` : `₹${coupon.value}`}
                </td>
                <td className="p-4 text-right">₹{coupon.minOrder}</td>
                <td className="p-4 text-center">
                  <span className="text-muted-foreground">{coupon.usedCount} / {coupon.maxUses}</span>
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(coupon.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
