import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import WaterTank from "@/components/WaterTank";
import LeakDetector from "@/components/LeakDetector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Droplet, TrendingDown, TrendingUp, Award } from "lucide-react";
import heroImage from "@/assets/hero-water.jpg";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [todayUsage, setTodayUsage] = useState(245);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalSaved: 1250,
    leaksFixed: 3,
    communityRank: 12,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadUserData(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadUserData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadUserData = async (userId: string) => {
    // Load community stats
    const { data: statsData } = await supabase
      .from("community_stats")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (statsData) {
      setStats({
        totalSaved: Number(statsData.total_saved_litres) || 0,
        leaksFixed: statsData.leaks_fixed || 0,
        communityRank: statsData.rank || 0,
      });
    }

    // Generate mock weekly data for charts
    const mockWeeklyData = [
      { day: "Mon", usage: 280 },
      { day: "Tue", usage: 250 },
      { day: "Wed", usage: 290 },
      { day: "Thu", usage: 230 },
      { day: "Fri", usage: 265 },
      { day: "Sat", usage: 310 },
      { day: "Sun", usage: 245 },
    ];
    setWeeklyData(mockWeeklyData);

    // Simulate live usage updates
    const interval = setInterval(() => {
      setTodayUsage((prev) => Math.min(prev + Math.random() * 5, 400));
    }, 10000);

    return () => clearInterval(interval);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const avgUsage = weeklyData.reduce((sum, d) => sum + d.usage, 0) / weeklyData.length;
  const costEstimate = (todayUsage * 0.015).toFixed(2); // R0.015 per litre

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <img src={heroImage} alt="Water Conservation" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/80 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Welcome to Your Water Dashboard
            </h1>
            <p className="text-xl text-white/90">Johannesburg, South Africa</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Droplet className="h-4 w-4" />
                Today's Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{todayUsage.toFixed(0)}L</div>
              <p className="text-xs opacity-80">R{costEstimate} estimated cost</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-success" />
                Total Saved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{stats.totalSaved}L</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-destructive" />
                Leaks Fixed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.leaksFixed}</div>
              <p className="text-xs text-muted-foreground">Total resolved</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-success text-success-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Award className="h-4 w-4" />
                Community Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">#{stats.communityRank || "..."}</div>
              <p className="text-xs opacity-80">In your area</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Water Tank */}
          <Card>
            <CardHeader>
              <CardTitle>Live Water Consumption</CardTitle>
              <CardDescription>Visual representation of today's usage</CardDescription>
            </CardHeader>
            <CardContent>
              <WaterTank currentUsage={todayUsage} maxCapacity={400} />
            </CardContent>
          </Card>

          {/* Leak Detector */}
          <LeakDetector userId={user?.id} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Usage Trend</CardTitle>
              <CardDescription>Your water consumption over the past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="usage" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Average: {avgUsage.toFixed(0)}L per day
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Comparison</CardTitle>
              <CardDescription>Usage breakdown by day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="usage" fill="hsl(var(--secondary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
