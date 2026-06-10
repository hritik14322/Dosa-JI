import "./_shared/_group.css";
import "./dosajii-home.css";
import { Navbar } from "./_shared/Navbar";
import { Footer } from "./_shared/Footer";
import { useState, useEffect } from "react";
import { ShieldCheck, Clock, Award, Star, ShoppingBag } from "lucide-react";

export function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Dosa 🫓");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    "Dosa 🫓", "Idli", "Vada", "Rice", "Beverages", "Sweets", "Combos", "Specials"
  ];

  const dishes = [
    { name: "Classic Masala Dosa", desc: "Crispy crepe filled with spiced potato mash.", price: "120", image: "dish1.png", veg: true },
    { name: "Sambar Idli (2 Pcs)", desc: "Soft steamed rice cakes dipped in hot sambar.", price: "80", image: "dish2.png", veg: true },
    { name: "Crispy Medu Vada", desc: "Deep fried lentil donuts served with chutney.", price: "90", image: "dish3.png", veg: true },
    { name: "Onion Tomato Uttapam", desc: "Thick pancake topped with fresh veggies.", price: "140", image: "dish4.png", veg: true },
    { name: "Ghee Pongal", desc: "Rice and lentils cooked with cumin and ghee.", price: "150", image: "dish5.png", veg: true },
    { name: "Filter Coffee", desc: "Authentic South Indian degree coffee.", price: "60", image: "dish6.png", veg: true }
  ];

  const features = [
    { icon: <ShieldCheck className="w-8 h-8 text-[#E8920A]" />, title: "Fresh & Hygienic", desc: "Prepared in a state-of-the-art clean kitchen." },
    { icon: <Award className="w-8 h-8 text-[#E8920A]" />, title: "Authentic Recipe", desc: "Traditional flavors straight from South India." },
    { icon: <Clock className="w-8 h-8 text-[#E8920A]" />, title: "Quick Delivery", desc: "Hot food at your doorstep in 30 minutes." },
    { icon: <ShoppingBag className="w-8 h-8 text-[#E8920A]" />, title: "Best Prices", desc: "Premium quality at pocket-friendly rates." }
  ];

  const testimonials = [
    { name: "Ravi Kumar", text: "The best masala dosa I've had in the city. Perfectly crispy and the chutney is divine!", rating: 5, initial: "R" },
    { name: "Sneha Patel", text: "Reminds me of my grandmother's cooking. The filter coffee is a must-try.", rating: 5, initial: "S" },
    { name: "Amit Sharma", text: "Great packaging and fast delivery. The food was still piping hot when it arrived.", rating: 4, initial: "A" }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF7] font-['Inter'] text-[#1C1C1C]">
      <Navbar scrolled={scrolled} />

      {/* HERO SECTION */}
      <section className="relative min-h-[100vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1A1200] to-[#3D2200]">
          <img 
            src="/__mockup/images/dosajii-hero.png" 
            alt="Delicious South Indian Food" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="font-['Playfair_Display'] text-5xl md:text-7xl lg:text-8xl font-bold text-[#E8920A] mb-4 tracking-wide animate-float">
            DOSA JII
          </h1>
          <p className="font-['Poppins'] italic text-xl md:text-2xl text-[#FFF8EE] mb-10">
            "Karna hai chill toh Dosa Ji se mill"
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#E8920A] to-[#F5A623] text-white font-medium rounded-full hover:shadow-[0_0_20px_rgba(232,146,10,0.4)] transition-all transform hover:-translate-y-1">
              Order Now
            </button>
            <button className="w-full sm:w-auto px-8 py-3.5 border-2 border-white text-white font-medium rounded-full hover:bg-white/10 transition-all">
              Explore Menu
            </button>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-[#1A1200] py-4 border-b-2 border-[#E8920A]/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-sm md:text-base text-amber-100/90 text-center font-medium">
            <span>500+ Happy Customers</span>
            <span className="hidden md:inline text-[#E8920A]">|</span>
            <span>30 Menu Items</span>
            <span className="hidden md:inline text-[#E8920A]">|</span>
            <span>4.8★ Rating</span>
            <span className="hidden md:inline text-[#E8920A]">|</span>
            <span>30 Min Delivery</span>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="bg-[#FFFFFF] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-['Playfair_Display'] text-3xl font-bold text-center mb-10 text-[#1C1C1C]">
            Browse by Category
          </h2>
          <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar justify-start md:justify-center">
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
              Our Specialties
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#E8920A] rounded-full"></div>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dishes.map((dish, i) => (
              <div 
                key={i} 
                className="bg-[#FFFFFF] rounded-xl overflow-hidden border border-[#F5C97A]/40 shadow-[0_2px_16px_rgba(232,146,10,0.10)] transition-transform duration-300 hover:-translate-y-2 group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={`/__mockup/images/${dish.image}`} 
                    alt={dish.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {dish.veg && (
                    <div className="absolute top-4 right-4 bg-white p-1 rounded border border-green-600 flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#1C1C1C] mb-2">{dish.name}</h3>
                  <p className="text-[#6B6B6B] text-sm mb-4 line-clamp-2 h-10">{dish.desc}</p>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-bold text-xl text-[#E8920A]">₹{dish.price}</span>
                  </div>
                  <button className="w-full py-2.5 bg-[#FFF8EE] text-[#E8920A] border border-[#E8920A] font-medium rounded-full hover:bg-[#E8920A] hover:text-white transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY DOSA JII? */}
      <section className="bg-[#FFF8EE] py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#1C1C1C] mb-4">Why Dosa Jii?</h2>
            <p className="text-[#6B6B6B] max-w-2xl mx-auto">Experience the perfect blend of tradition, quality, and taste in every bite.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl text-center border border-[#E8920A]/10 shadow-[0_2px_16px_rgba(232,146,10,0.05)]">
                <div className="mx-auto w-16 h-16 bg-[#FFF8EE] rounded-full flex items-center justify-center mb-6">
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
      <section className="bg-[#FFFFFF] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-['Playfair_Display'] text-4xl font-bold text-center mb-16 text-[#1C1C1C]">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, i) => (
              <div key={i} className="bg-[#FFF8EE] p-8 rounded-2xl border border-[#F5C97A]/30">
                <div className="flex gap-1 mb-4">
                  {[...Array(test.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-[#E8920A] text-[#E8920A]" />
                  ))}
                </div>
                <p className="text-[#1C1C1C] italic mb-6 leading-relaxed">"{test.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#E8920A] text-white rounded-full flex items-center justify-center font-bold">
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
      <section className="bg-[#1A1200] py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-[#E8920A] mb-8">
            Hungry? Order in 3 clicks.
          </h2>
          <button className="px-10 py-4 bg-gradient-to-r from-[#E8920A] to-[#F5A623] text-white text-lg font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(232,146,10,0.3)]">
            Order Now
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
