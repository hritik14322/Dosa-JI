import "./_group.css";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer style={{ background: "#1A1200" }} className="text-white pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="font-['Playfair_Display'] text-2xl font-bold mb-3">
              DOSA <span className="text-[#E8920A]">JII</span>
            </div>
            <p className="font-['Poppins'] italic text-amber-200/80 text-sm mb-4">"Karna hai chill toh Dosa Ji se mill"</p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full border border-amber-700 flex items-center justify-center hover:bg-[#E8920A] hover:border-[#E8920A] transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-['Inter'] font-semibold text-amber-300 uppercase text-xs tracking-widest mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "Menu", "About Us", "Contact", "Track Order"].map(link => (
                <li key={link}><a href="#" className="font-['Inter'] text-sm text-white/70 hover:text-[#E8920A] transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-['Inter'] font-semibold text-amber-300 uppercase text-xs tracking-widest mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex gap-2 items-start"><MapPin className="w-4 h-4 text-[#E8920A] mt-0.5 shrink-0" /><span className="font-['Inter'] text-sm text-white/70">123 South Street, Chennai, TN 600001</span></li>
              <li className="flex gap-2 items-center"><Phone className="w-4 h-4 text-[#E8920A] shrink-0" /><span className="font-['Inter'] text-sm text-white/70">+91 98765 43210</span></li>
              <li className="flex gap-2 items-center"><Mail className="w-4 h-4 text-[#E8920A] shrink-0" /><span className="font-['Inter'] text-sm text-white/70">hello@dosajii.com</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-['Inter'] font-semibold text-amber-300 uppercase text-xs tracking-widest mb-4">Opening Hours</h4>
            <ul className="space-y-2">
              {[["Mon – Fri", "7:00 AM – 10:00 PM"], ["Sat – Sun", "6:00 AM – 11:00 PM"], ["Delivery", "9:00 AM – 9:30 PM"]].map(([day, time]) => (
                <li key={day} className="flex justify-between gap-4">
                  <span className="font-['Inter'] text-sm text-white/70">{day}</span>
                  <span className="font-['Inter'] text-sm text-white/90">{time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-amber-900/50 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="font-['Inter'] text-xs text-white/40">© 2025 Dosa Jii. All rights reserved.</p>
          <p className="font-['Inter'] text-xs text-white/40">Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
}
