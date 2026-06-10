import { useState } from "react";
import { useListMenuItems } from "@workspace/api-client-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

type VegFilter = "all" | "veg" | "nonveg";

export default function Menu() {
  const [category, setCategory] = useState<string>("");
  const [vegFilter, setVegFilter] = useState<VegFilter>("all");

  // Fetch all items once to derive unique categories dynamically
  const { data: allItems } = useListMenuItems();

  const { data: menuItems, isLoading } = useListMenuItems({
    category: category || undefined,
    isVeg: vegFilter === "veg" ? true : vegFilter === "nonveg" ? false : undefined,
  });

  const { addItem } = useCart();
  const { user } = useAuth();
  const isStaff = user?.role === "shopkeeper" || user?.role === "admin";

  // Build category list dynamically from actual menu items
  const dynamicCategories = allItems
    ? Array.from(new Set(allItems.map((i) => i.category))).sort()
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold font-serif mb-8 text-center">Our Menu</h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        {/* Category pills — dynamically loaded */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              category === ""
                ? "bg-primary text-primary-foreground border-primary shadow"
                : "bg-background text-foreground border-border hover:border-primary/50"
            }`}
          >
            All
          </button>
          {dynamicCategories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                category === c
                  ? "bg-primary text-primary-foreground border-primary shadow"
                  : "bg-background text-foreground border-border hover:border-primary/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Veg / Non-veg 3-way toggle */}
        <div className="flex items-center bg-gray-100 rounded-full p-1 gap-1 flex-shrink-0">
          <button
            onClick={() => setVegFilter("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              vegFilter === "all" ? "bg-white shadow text-gray-800" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setVegFilter("veg")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-all ${
              vegFilter === "veg" ? "bg-green-500 shadow text-white" : "text-gray-500 hover:text-green-600"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            Veg
          </button>
          <button
            onClick={() => setVegFilter("nonveg")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-all ${
              vegFilter === "nonveg" ? "bg-red-500 shadow text-white" : "text-gray-500 hover:text-red-500"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            Non-Veg
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems?.map((item) => (
            <div key={item.id} className="bg-card rounded-xl shadow-sm border overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="h-48 bg-muted relative">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/10 text-4xl">
                    🍽️
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white p-1 rounded-sm shadow-sm">
                  <div className={`w-3 h-3 border-2 flex items-center justify-center ${item.isVeg ? "border-green-600" : "border-red-600"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? "bg-green-600" : "bg-red-600"}`} />
                  </div>
                </div>
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-white text-sm font-semibold px-3 py-1 rounded-full text-red-600">Out of Stock</span>
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                  <span className="font-bold text-primary whitespace-nowrap ml-2">₹{item.price}</span>
                </div>

                {item.sizes && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.sizes.split(",").map((s) => s.trim()).filter(Boolean).map((s) => (
                      <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-2">{item.description}</p>

                {!isStaff && (
                  <button
                    onClick={() => addItem({ menuItemId: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl })}
                    disabled={!item.isAvailable}
                    className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                      item.isAvailable
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {item.isAvailable ? "Add to Cart" : "Out of Stock"}
                  </button>
                )}
              </div>
            </div>
          ))}
          {menuItems?.length === 0 && (
            <div className="col-span-full text-center py-20 text-muted-foreground">
              No items found for the selected filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
