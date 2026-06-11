import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useGetSettings, useUpdateSettings } from "@workspace/api-client-react";
import { Loader2 } from "lucide-react";

export default function AdminSettings() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useGetSettings();
  const updateMutation = useUpdateSettings();

  const [form, setForm] = useState({
    restaurantName: "",
    tagline: "",
    address: "",
    phone: "",
    deliveryCharge: "",
    gstPercent: "",
    freeDeliveryAbove: "",
  });

  useEffect(() => {
    if (settings) {
      setForm({
        restaurantName: settings.restaurantName,
        tagline: settings.tagline,
        address: settings.address,
        phone: settings.phone,
        deliveryCharge: String(settings.deliveryCharge),
        gstPercent: String(settings.gstPercent),
        freeDeliveryAbove: String(settings.freeDeliveryAbove),
      });
    }
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      data: {
        restaurantName: form.restaurantName,
        tagline: form.tagline,
        address: form.address,
        phone: form.phone,
        deliveryCharge: parseFloat(form.deliveryCharge) || 0,
        gstPercent: parseFloat(form.gstPercent) || 0,
        freeDeliveryAbove: parseFloat(form.freeDeliveryAbove) || 0,
      },
    }, {
      onSuccess: () => {
        toast({ title: "Settings saved ✓", description: "Restaurant settings updated successfully." });
      },
      onError: (err: any) => {
        toast({ title: "Save failed", description: err?.error || "Could not update settings.", variant: "destructive" });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

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
          <Button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</>
            ) : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
