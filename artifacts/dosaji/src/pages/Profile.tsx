import { useAuth } from "@/contexts/AuthContext";
import { useGetMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Profile() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { data: profile, isLoading } = useGetMe();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold font-serif mb-8 text-center">My Profile</h1>
      
      <div className="bg-card rounded-xl p-8 shadow-sm border">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b">
          <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center text-3xl font-bold">
            {profile?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{profile?.name}</h2>
            <p className="text-muted-foreground">{profile?.email}</p>
            <div className="mt-2 inline-block px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-semibold capitalize">
              {profile?.role}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <span className="block text-xs text-muted-foreground mb-1">Phone Number</span>
                <span className="font-medium">{profile?.phone || "Not provided"}</span>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <span className="block text-xs text-muted-foreground mb-1">Address</span>
                <span className="font-medium">{profile?.address || "Not provided"}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Account Details</h3>
            <div className="bg-muted/30 p-4 rounded-lg">
              <span className="block text-xs text-muted-foreground mb-1">Member Since</span>
              <span className="font-medium">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "Unknown"}</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <Button variant="destructive" onClick={handleLogout}>Log Out</Button>
        </div>
      </div>
    </div>
  );
}
