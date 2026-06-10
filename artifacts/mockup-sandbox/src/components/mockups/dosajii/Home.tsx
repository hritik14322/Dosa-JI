import "./_shared/_group.css";
import "./dosajii-home.css";
import { Navbar } from "./_shared/Navbar";
import { Footer } from "./_shared/Footer";
import { useState, useEffect } from "react";
import { ShieldCheck, Clock, Award, Star, ShoppingBag } from "lucide-react";

export function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("🍕 Pizza");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    "🍕 Pizza", "🍔 Burgers", "🌮 Wraps", "🍟 Fries", "🥤 Shakes", "🎁 Combos", "⭐ Specials"
  ];

  const dishes = [
    { name: "Farmhouse Pizza", desc: "Loaded with fresh vegetables and double cheese.", price: "299", image: "pizza.png", veg: true },
    { name: "Juicy Double Burger", desc: "Double patty burger with melted cheese and our secret sauce.", price: "149", image: "burger.png", veg: false },
    { name: "Loaded Cheese Fries", desc: "Golden fries topped with jalapenos and cheese sauce.", price: "129", image: "fries.png", veg: true },
    { name: "Spicy Paneer Wrap", desc: "Grilled paneer with crunchy veggies in a soft tortilla.", price: "139", image: "wrap.png", veg: true },
    { name: "Thick Chocolate Shake", desc: "Rich chocolate blend topped with whipped cream.", price: "119", image: "shake.png", veg: true },
    { name: "Mega Combo Meal", desc: "Burger, fries, and a refreshing drink.", price: "249", image: "combo.png", veg: true }
  ];

  const features = [
    { icon: <ShieldCheck className="w-8 h-8 text-[#E8920A]" />, title: "Fresh Daily", desc: "Prepared with high-quality ingredients every day." },
    { icon: <Award className="w-8 h-8 text-[#E8920A]" />, title: "Loaded Portions", desc: "Generous servings that satisfy your cravings." },
    { icon: <Clock className="w-8 h-8 text-[#E8920A]" />, title: "Quick Delivery", desc: "Hot and fresh food at your doorstep." },
    { icon: <ShoppingBag className="w-8 h-8 text-[#E8920A]" />, title: "Best Value", desc: "Premium taste at pocket-friendly rates." }
  ];

  const testimonials = [
    { name: "Rahul S.", text: "The loaded fries are to die for! Easily the best fast food joint in town.", rating: 5, initial: "R" },
    { name: "Neha K.", text: "Love the Farmhouse Pizza. Great crust and generous toppings.", rating: 5, initial: "N" },
    { name: "Vikas M.", text: "Fast delivery and the food was perfectly hot. Highly recommended for late night cravings.", rating: 4, initial: "V" }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF7] font-['Inter'] text-[#1C1C1C]">
      <Navbar scrolled={scrolled} />

      {/* HERO SECTION */}
      <section className="relative min-h-[100vh] flex items-center justify-center pt-20 overflow-hidden bg-gradient-to-b from-[#1A1200] to-[#3D2200]">
        <div className="absolute inset-0 z-0">
          <img 
            src="/__mockup/images/dosa-ji-hero.png" 
            alt="Delicious Fast Food Spread" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        {/* Floating Emojis */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 text-6xl emoji-float-1">🍕</div>
          <div className="absolute top-1/3 right-1/4 text-5xl emoji-float-2">🍔</div>
          <div className="absolute bottom-1/4 left-1/3 text-6xl emoji-float-3">🍟</div>
          <div className="absolute top-2/3 right-1/3 text-5xl emoji-float-1">🥤</div>
          <div className="absolute bottom-1/3 right-1/6 text-6xl emoji-float-2">🌮</div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <img 
            src="/__mockup/images/dosa-ji-logo.png" 
            alt="Dosa Ji Logo" 
            className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-[#E8920A] shadow-[0_0_15px_rgba(232,146,10,0.5)]"
          />
          <h1 className="font-['Playfair_Display'] text-5xl md:text-7xl lg:text-8xl font-bold text-[#E8920A] mb-4 tracking-wide">
            Dosa Ji
          </h1>
          <p className="font-['Poppins'] italic text-xl md:text-2xl text-[#FFF8EE] mb-10">
            "Karna hai chill toh Dosa Ji se mill"
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#F5A623] to-[#E8920A] text-white font-medium rounded-full hover:shadow-[0_0_20px_rgba(232,146,10,0.6)] transition-all transform hover:-translate-y-1">
              Order Now
            </button>
            <button className="w-full sm:w-auto px-8 py-3.5 border-2 border-white text-white font-medium rounded-full hover:bg-white/10 transition-all">
              Explore Menu
            </button>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-[#1A1200] py-4 border-b border-t border-[#E8920A]/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-sm md:text-base text-amber-100/90 text-center font-medium">
            <span>500+ Happy Customers</span>
            <span className="hidden md:inline text-[#E8920A]">•</span>
            <span>30+ Menu Items</span>
            <span className="hidden md:inline text-[#E8920A]">•</span>
            <span>4.8★ Rating</span>
            <span className="hidden md:inline text-[#E8920A]">•</span>
            <span>30 Min Delivery</span>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="bg-[#FFFFFF] py-10 border-b border-[#E8920A]/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar justify-start lg:justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-[#E8920A] text-white shadow-[0_4px_12px_rgba(232,146,10,0.3)] border border-[#E8920A]"
                    : "bg-[#FFF8EE] text-[#1C1C1C] border border-[#E8920A]/30 hover:border-[#E8920A]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED DISHES */}
      <section className="bg-[#FFF8EE] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#1C1C1C] inline-block relative">
              Our Popular Picks
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#E8920A] rounded-full"></div>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dishes.map((dish, i) => (
              <div 
                key={i} 
                className="bg-[#FFFFFF] rounded-xl overflow-hidden border border-[rgba(245,201,122,0.4)] shadow-[0_2px_16px_rgba(232,146,10,0.10)] transition-transform duration-300 hover:-translate-y-2 group"
              >
                <div className="relative h-56 overflow-hidden bg-[#FFF8EE]">
                  <img 
                    src={`/__mockup/images/${dish.image}`} 
                    alt={dish.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white p-1 rounded border flex items-center justify-center shadow-sm">
                    <div className={`w-3 h-3 rounded-full ${dish.veg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#1C1C1C] mb-2">{dish.name}</h3>
                  <p className="text-[#6B6B6B] text-sm mb-4 line-clamp-2 h-10">{dish.desc}</p>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-bold text-xl text-[#E8920A]">₹{dish.price}</span>
                  </div>
                  <button className="w-full py-2.5 bg-gradient-to-r from-[#F5A623] to-[#E8920A] text-white font-medium rounded-full shadow-sm hover:shadow-md transition-shadow">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY DOSA JII? */}
      <section className="bg-[#FFFDF7] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#1C1C1C] mb-4">Why Dosa Ji?</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-[#FFF8EE] p-8 rounded-xl text-center border border-[rgba(245,201,122,0.4)] shadow-[0_2px_16px_rgba(232,146,10,0.05)] hover:shadow-[0_2px_16px_rgba(232,146,10,0.15)] transition-shadow">
                <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-amber-100">
                  {feature.icon}
                </div>
                <h3 className="font-['Playfair_Display'] text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[#6B6B6B] text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#FFF8EE] py-20 border-t border-[rgba(245,201,122,0.2)]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-['Playfair_Display'] text-4xl font-bold text-center mb-16 text-[#1C1C1C]">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, i) => (
              <div key={i} className="bg-[#FFFFFF] p-8 rounded-xl border border-[rgba(245,201,122,0.4)] shadow-[0_2px_16px_rgba(232,146,10,0.05)]">
                <div className="flex gap-1 mb-4">
                  {[...Array(test.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-[#E8920A] text-[#E8920A]" />
                  ))}
                </div>
                <p className="text-[#6B6B6B] italic mb-6 leading-relaxed">"{test.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#F5A623] to-[#E8920A] text-white rounded-full flex items-center justify-center font-bold">
                    {test.initial}
                  </div>
                  <span className="font-medium text-[#1C1C1C]">{test.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-[#1A1200] py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#E8920A] to-transparent"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-[#E8920A] mb-8 leading-tight">
            Craving something good? <br/>Order in 3 clicks.
          </h2>
          <button className="px-10 py-4 bg-gradient-to-r from-[#F5A623] to-[#E8920A] text-white text-lg font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(232,146,10,0.4)]">
            Order Now
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
