import { usersTable, menuItemsTable, couponsTable } from "./schema";
import bcrypt from "bcryptjs";

export async function seedDatabase(db: any) {
  // Users
  const adminHash = await bcrypt.hash("admin123", 10);
  const shopHash = await bcrypt.hash("shop123", 10);
  const custHash = await bcrypt.hash("customer123", 10);

  await db.insert(usersTable).values([
    { name: "Admin", email: "admin@dosaji.com", passwordHash: adminHash, role: "admin" },
    { name: "Shopkeeper", email: "shop@dosaji.com", passwordHash: shopHash, role: "shopkeeper" },
    { name: "Arjun Mehta", email: "customer@dosaji.com", passwordHash: custHash, role: "customer" },
  ]);

  // Menu items
  await db.insert(menuItemsTable).values([
    // Dosas
    {
      name: "Classic Masala Dosa",
      description: "Crispy golden dosa stuffed with spiced potato filling, served with sambar and chutneys",
      price: "89",
      category: "Dosa",
      imageUrl: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80",
      isVeg: true,
      isAvailable: true,
      isFeatured: true,
    },
    {
      name: "Cheese Burst Dosa",
      description: "Thin crispy dosa loaded with melted cheese and spiced potato filling",
      price: "129",
      category: "Dosa",
      imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80",
      isVeg: true,
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: "Egg Dosa",
      description: "Crispy dosa topped with a fresh egg, onions, and spices",
      price: "99",
      category: "Dosa",
      imageUrl: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80",
      isVeg: false,
      isAvailable: true,
      isFeatured: false,
    },
    // Pizzas
    {
      name: "Margherita Pizza",
      description: "Classic tomato sauce, fresh mozzarella, and basil on a hand-tossed crust",
      price: "199",
      category: "Pizza",
      imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
      isVeg: true,
      isAvailable: true,
      isFeatured: true,
    },
    {
      name: "Chicken BBQ Pizza",
      description: "Smoky BBQ sauce, grilled chicken, red onions, and bell peppers",
      price: "269",
      category: "Pizza",
      imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
      isVeg: false,
      isAvailable: true,
      isFeatured: true,
    },
    {
      name: "Paneer Tikka Pizza",
      description: "Spiced paneer tikka, green peppers, onions, and tikka sauce",
      price: "239",
      category: "Pizza",
      imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
      isVeg: true,
      isAvailable: true,
      isFeatured: false,
    },
    // Burgers
    {
      name: "Crispy Aloo Burger",
      description: "Crunchy potato patty with lettuce, tomato, and special sauce in a toasted bun",
      price: "79",
      category: "Burger",
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
      isVeg: true,
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: "Spicy Chicken Burger",
      description: "Juicy spiced chicken fillet, coleslaw, and sriracha mayo",
      price: "149",
      category: "Burger",
      imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&q=80",
      isVeg: false,
      isAvailable: true,
      isFeatured: true,
    },
    // Rolls
    {
      name: "Paneer Kathi Roll",
      description: "Spiced paneer, onions, and green chutney wrapped in a flaky paratha",
      price: "99",
      category: "Roll",
      imageUrl: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80",
      isVeg: true,
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: "Chicken Tikka Roll",
      description: "Tender chicken tikka, onions, and mint chutney in a flaky paratha",
      price: "119",
      category: "Roll",
      imageUrl: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80",
      isVeg: false,
      isAvailable: true,
      isFeatured: true,
    },
    // Drinks
    {
      name: "Mango Lassi",
      description: "Thick, creamy yogurt-based mango drink — chilled and refreshing",
      price: "59",
      category: "Drinks",
      imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80",
      isVeg: true,
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: "Masala Chai",
      description: "Aromatic spiced tea with ginger, cardamom, and milk",
      price: "29",
      category: "Drinks",
      imageUrl: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&q=80",
      isVeg: true,
      isAvailable: true,
      isFeatured: false,
    },
  ]);

  // Coupons
  await db.insert(couponsTable).values([
    {
      code: "WELCOME10",
      discountType: "percent",
      value: "10",
      minOrder: "100",
      maxUses: 500,
      isActive: true,
    },
    {
      code: "FLAT50",
      discountType: "flat",
      value: "50",
      minOrder: "250",
      maxUses: 200,
      isActive: true,
    },
  ]);
}
