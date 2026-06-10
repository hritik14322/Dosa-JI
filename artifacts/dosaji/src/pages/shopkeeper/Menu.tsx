import { useState } from "react";
import { useListMenuItems, useToggleMenuItemAvailability, getListMenuItemsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function ShopkeeperMenu() {
  const { data: menuItems, isLoading } = useListMenuItems();
  const toggleMutation = useToggleMenuItemAvailability();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleToggle = (id: number, current: boolean) => {
    toggleMutation.mutate({ id, data: { isAvailable: !current } }, {
      onSuccess: () => {
        toast({ title: "Availability updated", description: "Menu item updated successfully." });
        queryClient.invalidateQueries({ queryKey: getListMenuItemsQueryKey() });
      }
    });
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-serif mb-8">Menu Availability</h1>
      
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="p-4 font-semibold">Item</th>
                <th className="p-4 font-semibold text-center w-24">Veg/Non-Veg</th>
                <th className="p-4 font-semibold text-right w-32">Price</th>
                <th className="p-4 font-semibold text-center w-40">Available</th>
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
                        <div className="text-xs text-muted-foreground">{item.category}</div>
                      </div>
                    </div>
                  </td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
