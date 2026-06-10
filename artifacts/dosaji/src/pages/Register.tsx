import { useState } from "react";
import { useRegister } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import logoSrc from "@assets/dosa_ji_logo_1781074968971.png";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "shopkeeper">("customer");
  
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const registerMutation = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ data: { name, email, password, role } }, {
      onSuccess: (data) => {
        login(data.token, data.user);
        toast({ title: "Account created!", description: "Welcome to Dosa Ji." });
        if (data.user.role === "shopkeeper") setLocation("/shopkeeper");
        else setLocation("/");
      },
      onError: (err: any) => {
        toast({ title: "Registration failed", description: err.error || "Could not create account", variant: "destructive" });
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-muted/30">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-lg border p-8">
        <div className="text-center mb-8">
          <img src={logoSrc} alt="Dosa Ji Logo" className="h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold font-serif mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join the Dosa Ji family</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" required value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <div className="space-y-3 pt-2">
            <Label>I want to...</Label>
            <RadioGroup value={role} onValueChange={(v) => setRole(v as any)} className="flex gap-4">
              <div className="flex items-center space-x-2 border p-3 rounded-md flex-1 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="customer" id="r1" />
                <Label htmlFor="r1" className="cursor-pointer">Order food</Label>
              </div>
              <div className="flex items-center space-x-2 border p-3 rounded-md flex-1 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="shopkeeper" id="r2" />
                <Label htmlFor="r2" className="cursor-pointer">Manage shop</Label>
              </div>
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full h-12 text-lg mt-4" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/login" className="text-primary font-bold hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
