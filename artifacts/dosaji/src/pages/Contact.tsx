import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message sent!", description: "We'll get back to you as soon as possible." });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Have a question or feedback? We'd love to hear from you.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="bg-card rounded-2xl p-8 shadow-sm border">
          <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" required placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" required placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" required placeholder="How can we help you?" className="min-h-[150px]" />
            </div>
            <Button type="submit" className="w-full h-12 text-lg">Send Message</Button>
          </form>
        </div>

        <div className="space-y-8">
          <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="text-primary" />
              Visit Us
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              123 Food Street, Culinary Avenue<br />
              Foodville, FD 12345
            </p>
            <div className="w-full h-48 bg-muted rounded-xl flex items-center justify-center text-muted-foreground">Map Placeholder</div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-6 shadow-sm border flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Call Us</h4>
                <p className="text-muted-foreground">+91 95071 07204</p>
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-sm border flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Email Us</h4>
                <p className="text-muted-foreground">shreejanandan1@gmail.com</p>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border flex items-start gap-4 sm:col-span-2">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Opening Hours</h4>
                <p className="text-muted-foreground">Monday - Sunday: 10:00 AM - 11:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
