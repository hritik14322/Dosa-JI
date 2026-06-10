import { useState } from "react";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import logoSrc from "@assets/dosa_ji_logo_1781074968971.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ data: { email, password } }, {
      onSuccess: (data) => {
        login(data.token, data.user);
        toast({ title: "Welcome back!", description: "Successfully logged in." });
        if (data.user.role === "admin") setLocation("/admin");
        else if (data.user.role === "shopkeeper") setLocation("/shopkeeper");
        else setLocation("/");
      },
      onError: (err: any) => {
        toast({ title: "Login failed", description: err.error || "Invalid credentials", variant: "destructive" });
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-muted/30">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-lg border p-8">
        <div className="text-center mb-8">
          <img src={logoSrc} alt="Dosa Ji Logo" className="h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold font-serif mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
            </div>
            <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <Button type="submit" className="w-full h-12 text-lg" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link href="/register" className="text-primary font-bold hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
