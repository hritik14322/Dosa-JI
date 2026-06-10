import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    restaurantName: "Dosa Ji",
    tagline: "Delicious Fast Food",
    address: "123 Food Street, Foodie City",
    phone: "+91 95071 07204",
    deliveryCharge: "30",
    gstPercent: "5",
    freeDeliveryAbove: "299",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Settings saved", description: "Restaurant settings updated successfully." });
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Restaurant Settings</h1>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-amber-100 shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Restaurant Name</Label>
            <Input value={form.restaurantName} onChange={(e) => setForm({ ...form, restaurantName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Tagline</Label>
            <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Address</Label>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Phone</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Delivery Charge</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <Input className="pl-7" value={form.deliveryCharge} onChange={(e) => setForm({ ...form, deliveryCharge: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">GST %</Label>
            <Input type="number" min={0} value={form.gstPercent} onChange={(e) => setForm({ ...form, gstPercent: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Free Delivery Above</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <Input className="pl-7" value={form.freeDeliveryAbove} onChange={(e) => setForm({ ...form, freeDeliveryAbove: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8">
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
