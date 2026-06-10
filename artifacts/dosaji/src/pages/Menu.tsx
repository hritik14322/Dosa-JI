import { useState } from "react";
import { useListMenuItems } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Menu() {
  const [category, setCategory] = useState<string>("");
  const [isVeg, setIsVeg] = useState<boolean | undefined>(undefined);
  const { data: menuItems, isLoading } = useListMenuItems({ category: category || undefined, isVeg });
  const { addItem } = useCart();
  const { user } = useAuth();

  const isStaff = user?.role === "shopkeeper" || user?.role === "admin";

  const categories = ["All", "Dosa", "Pizza", "Burger", "Rolls", "Beverages"];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold font-serif mb-8 text-center">Our Menu</h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Button
              key={c}
              variant={category === (c === "All" ? "" : c) ? "default" : "outline"}
              onClick={() => setCategory(c === "All" ? "" : c)}
              className="rounded-full"
            >
              {c}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isVeg === true ? "default" : "outline"}
            onClick={() => setIsVeg(isVeg === true ? undefined : true)}
            className="rounded-full bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          >
            Pure Veg
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems?.map((item) => (
            <div key={item.id} className="bg-card rounded-xl shadow-sm border overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="h-48 bg-muted relative">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/10">No image</div>
                )}
                {item.isVeg ? (
                  <div className="absolute top-2 right-2 bg-white p-1 rounded-sm shadow-sm">
                    <div className="w-3 h-3 border-2 border-green-600 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    </div>
                  </div>
                ) : (
                  <div className="absolute top-2 right-2 bg-white p-1 rounded-sm shadow-sm">
                    <div className="w-3 h-3 border-2 border-red-600 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                    </div>
                  </div>
                )}
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-white text-sm font-semibold px-3 py-1 rounded-full text-red-600">Out of Stock</span>
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                  <span className="font-bold text-primary whitespace-nowrap ml-2">₹{item.price}</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-2">{item.description}</p>
                {!isStaff && (
                  <Button
                    onClick={() => addItem({ menuItemId: item.id, name: item.name, price: item.price, quantity: 1, imageUrl: item.imageUrl })}
                    disabled={!item.isAvailable}
                    className="w-full"
                    variant={item.isAvailable ? "default" : "secondary"}
                  >
                    {item.isAvailable ? "Add to Cart" : "Out of Stock"}
                  </Button>
                )}
              </div>
            </div>
          ))}
          {menuItems?.length === 0 && (
            <div className="col-span-full text-center py-20 text-muted-foreground">
              No menu items found for the selected filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
