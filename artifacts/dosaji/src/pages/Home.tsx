import { useListMenuItems } from "@workspace/api-client-react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldCheck, Clock, Award, ShoppingBag, Star } from "lucide-react";
import logoSrc from "@assets/dosa_ji_logo_1781074968971.png";

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
  "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
  "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&q=80",
  "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=80",
];

const WHY_FEATURES = [
  { icon: ShieldCheck, title: "Fresh Daily", desc: "Prepared with high-quality ingredients every single day." },
  { icon: Award, title: "Loaded Portions", desc: "Generous servings that truly satisfy your cravings." },
  { icon: Clock, title: "Quick Delivery", desc: "Hot and fresh food delivered right to your doorstep." },
  { icon: ShoppingBag, title: "Best Value", desc: "Premium taste at pocket-friendly rates." },
];

const TESTIMONIALS = [
  { name: "Rahul S.", initial: "R", rating: 5, text: "The loaded fries are to die for! Easily the best fast food joint in town." },
  { name: "Neha K.", initial: "N", rating: 5, text: "Love the Farmhouse Pizza. Great crust and generous toppings." },
  { name: "Vikas M.", initial: "V", rating: 4, text: "Fast delivery and the food was perfectly hot. Highly recommended for late night cravings." },
];

export default function Home() {
  const { data: featuredItems, isLoading } = useListMenuItems({ featured: true });
  const { user } = useAuth();

  const isStaff = user?.role === "shopkeeper" || user?.role === "admin";

  return (
    <div className="flex flex-col min-h-[100dvh]">

      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2">
          {BG_IMAGES.map((src, i) => (
            <img key={i} src={src} alt="" className="w-full h-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
          ))}
        </div>
        <div className="absolute inset-0 bg-black/68" />
        <div className="relative z-10 flex flex-col items-center px-6">
          <img src={logoSrc} alt="Dosa Ji" className="h-20 w-20 object-contain mb-6 drop-shadow-2xl" />
          <h1
            className="text-6xl md:text-8xl font-bold font-serif tracking-tight mb-1"
            style={{
              color: "#fff8ee",
              textShadow:
                "0 0 6px #fff, 0 0 14px #fff, 0 0 28px #f59e0b, 0 0 52px #f59e0b, 0 0 80px #d97706, 0 0 120px #b45309",
            }}
          >
            Dosa Ji
          </h1>
          {/* Neon swoosh decoration */}
          <svg
            viewBox="0 0 320 28"
            className="w-64 md:w-80 mb-8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <line x1="0" y1="10" x2="105" y2="10" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <path
              d="M 108 10 C 120 2, 150 22, 160 14 C 170 6, 200 26, 212 10"
              stroke="#f59e0b"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <line x1="215" y1="10" x2="320" y2="10" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </svg>
          <p className="text-lg md:text-2xl text-white/80 italic mb-10 font-light">
            "Karna hai chill toh Dosa Ji se mill"
          </p>
          {!isStaff && (
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/menu" className="px-10 py-3.5 rounded-full bg-amber-500 text-white font-semibold text-base shadow-lg hover:bg-amber-400 transition-colors">
                Order Now
              </Link>
              <Link href="/menu" className="px-10 py-3.5 rounded-full border-2 border-white text-white font-semibold text-base hover:bg-white/10 transition-colors">
                Explore Menu
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="bg-[#1a1200] py-4 border-y border-amber-900/40">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm md:text-base text-amber-100/90 text-center font-medium">
            <span>500+ Happy Customers</span>
            <span className="hidden md:inline text-amber-500">•</span>
            <span>30+ Menu Items</span>
            <span className="hidden md:inline text-amber-500">•</span>
            <span>4.8★ Rating</span>
            <span className="hidden md:inline text-amber-500">•</span>
            <span>30 Min Delivery</span>
          </div>
        </div>
      </div>

      {/* ── Our Popular Picks ── */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 bg-[#fff8ee]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl font-bold text-[#1c1c1c] inline-block relative">
              Our Popular Picks
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-1 bg-amber-500 rounded-full block" />
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredItems?.slice(0, 6).map((item) => (
                <div key={item.id} className="bg-white rounded-xl overflow-hidden border border-amber-200/60 shadow-sm hover:-translate-y-1 transition-transform duration-300 group">
                  <div className="relative h-52 overflow-hidden bg-[#fff8ee]">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No Image</div>
                    )}
                    <div className="absolute top-3 right-3 bg-white p-1 rounded border flex items-center justify-center shadow-sm">
                      <div className={`w-3 h-3 rounded-full ${item.isVeg ? "bg-green-600" : "bg-red-600"}`} />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-serif text-xl font-bold text-[#1c1c1c]">{item.name}</h3>
                      <span className="font-bold text-lg text-amber-600 ml-2">₹{item.price}</span>
                    </div>
                    <p className="text-[#6b6b6b] text-sm mb-5 line-clamp-2">{item.description}</p>
                    {!isStaff && (
                      <Link href="/menu" className="block w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-semibold rounded-full text-center text-sm shadow-sm hover:shadow-md transition-shadow">
                        Order Now
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isStaff && (
            <div className="text-center mt-10">
              <Link href="/menu" className="inline-block px-8 py-3 border-2 border-amber-500 text-amber-600 font-semibold rounded-full hover:bg-amber-50 transition-colors text-sm">
                View Full Menu →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Why Dosa Ji ── */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 bg-[#fffdf7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl font-bold text-[#1c1c1c] mb-2">Why Dosa Ji?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-[#fff8ee] p-8 rounded-xl text-center border border-amber-200/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-amber-100">
                  <Icon className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3 text-[#1c1c1c]">{title}</h3>
                <p className="text-[#6b6b6b] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What Our Customers Say ── */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 bg-[#fff8ee] border-t border-amber-200/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl font-bold text-[#1c1c1c]">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map(({ name, initial, rating, text }) => (
              <div key={name} className="bg-white p-8 rounded-xl border border-amber-200/50 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-amber-500 text-amber-500" />
                  ))}
                  {Array.from({ length: 5 - rating }).map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-amber-200" />
                  ))}
                </div>
                <p className="text-[#6b6b6b] italic mb-6 leading-relaxed">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {initial}
                  </div>
                  <span className="font-medium text-[#1c1c1c]">{name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      {!isStaff && (
        <section className="bg-[#1a1200] py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,146,10,0.12)_0%,transparent_70%)]" />
          <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-amber-500 mb-8 leading-tight">
              Craving something good?<br />Order in 3 clicks.
            </h2>
            <Link
              href="/menu"
              className="inline-block px-10 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-lg font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(232,146,10,0.4)]"
            >
              Order Now
            </Link>
          </div>
        </section>
      )}

    </div>
  );
}
