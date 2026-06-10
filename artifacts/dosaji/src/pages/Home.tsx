import { useListMenuItems } from "@workspace/api-client-react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import logoSrc from "@assets/dosa_ji_logo_1781074968971.png";

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
  "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
  "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&q=80",
  "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=80",
];

export default function Home() {
  const { data: featuredItems, isLoading } = useListMenuItems({ featured: true });
  const { user } = useAuth();

  const isStaff = user?.role === "shopkeeper" || user?.role === "admin";

  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* Dark Hero Section */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Multi-image food background grid */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2">
          {BG_IMAGES.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="w-full h-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
          ))}
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/68" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-6">
          <img src={logoSrc} alt="Dosa Ji" className="h-20 w-20 object-contain mb-6 drop-shadow-2xl" />

          <h1 className="text-6xl md:text-8xl font-bold font-serif text-amber-400 mb-4 drop-shadow-lg tracking-tight">
            Dosa Ji
          </h1>

          <p className="text-lg md:text-2xl text-white/80 italic mb-10 font-light">
            "Karna hai chill toh Dosa Ji se mill"
          </p>

          {!isStaff && (
            <div className="flex gap-4 flex-wrap justify-center">
              <Link
                href="/menu"
                className="px-10 py-3.5 rounded-full bg-amber-500 text-white font-semibold text-base shadow-lg hover:bg-amber-400 transition-colors"
              >
                Order Now
              </Link>
              <Link
                href="/about"
                className="px-10 py-3.5 rounded-full border-2 border-white text-white font-semibold text-base hover:bg-white/10 transition-colors"
              >
                Explore Menu
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 bg-background">
        <h2 className="text-3xl font-bold font-serif mb-10 text-center">Featured Delights</h2>
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredItems?.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-52 bg-muted w-full">
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
                  {!isStaff && (
                    <Link href="/menu" className="text-primary font-medium hover:underline text-sm">
                      View in Menu →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
