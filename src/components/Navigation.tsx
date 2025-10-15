import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Droplets, Users, Briefcase, BookOpen, LayoutDashboard, LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "sonner";

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
      navigate("/auth");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card border-b border-border shadow-water sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-primary p-2 rounded-lg shadow-glow">
              <Droplets className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AquaSavvy
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link to="/">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                className="gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/community">
              <Button
                variant={isActive("/community") ? "default" : "ghost"}
                className="gap-2"
              >
                <Users className="h-4 w-4" />
                Community
              </Button>
            </Link>
            <Link to="/career">
              <Button
                variant={isActive("/career") ? "default" : "ghost"}
                className="gap-2"
              >
                <Briefcase className="h-4 w-4" />
                Careers
              </Button>
            </Link>
            <Link to="/tips">
              <Button
                variant={isActive("/tips") ? "default" : "ghost"}
                className="gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Tips
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="outline" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" onClick={handleSignOut} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline">Sign Out</span>
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button className="bg-gradient-primary">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
