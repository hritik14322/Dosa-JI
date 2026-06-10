import { useListMenuItems } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: featuredItems, isLoading } = useListMenuItems({ featured: true });

  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* Hero Section */}
      <section className="bg-primary/10 py-20 px-6 sm:px-12 lg:px-24 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-bold font-serif text-foreground mb-6">
          Welcome to Dosa Ji
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl">
          Authentic South Indian flavors, mouth-watering pizzas, and more. Crafted with love, served with joy.
        </p>
        <div className="flex gap-4">
          <Link href="/menu" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-8 py-2">
            Order Now
          </Link>
          <Link href="/about" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 px-8 py-2">
            Our Story
          </Link>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 px-6 sm:px-12 lg:px-24">
        <h2 className="text-3xl font-bold font-serif mb-10 text-center">Featured Delights</h2>
        {isLoading ? (
          <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredItems?.slice(0, 3).map((item) => (
              <div key={item.id} className="bg-card rounded-xl shadow-sm border overflow-hidden hover-elevate transition-transform">
                <div className="h-48 bg-muted w-full relative">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl">{item.name}</h3>
                    <span className="font-semibold text-primary">₹{item.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{item.description}</p>
                  <Link href={`/menu`} className="text-primary font-medium hover:underline text-sm">
                    View in Menu &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
