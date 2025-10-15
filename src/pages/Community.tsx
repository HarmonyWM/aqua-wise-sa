import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Award, Medal, Users, Droplet, TrendingUp } from "lucide-react";

export default function Community() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [communityTotal, setCommunityTotal] = useState({ saved: 0, members: 0 });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        loadCommunityData();
      }
    });
  }, [navigate]);

  const loadCommunityData = async () => {
    const { data: stats } = await supabase
      .from("community_stats")
      .select("*, profiles(full_name, location)")
      .order("total_saved_litres", { ascending: false })
      .limit(20);

    if (stats) {
      const rankedStats = stats.map((stat, index) => ({
        ...stat,
        rank: index + 1,
      }));
      setLeaderboard(rankedStats);

      const totalSaved = stats.reduce((sum, s) => sum + Number(s.total_saved_litres || 0), 0);
      setCommunityTotal({ saved: totalSaved, members: stats.length });
    }
  };

  const getBadgeForRank = (rank: number) => {
    if (rank === 1) return { icon: Trophy, color: "text-yellow-500", label: "Champion" };
    if (rank === 2) return { icon: Award, color: "text-gray-400", label: "Runner-up" };
    if (rank === 3) return { icon: Medal, color: "text-amber-600", label: "Third Place" };
    return { icon: TrendingUp, color: "text-primary", label: "Contributor" };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Community Water Challenge</h1>
          <p className="text-xl text-muted-foreground">
            Together, we're making every drop count in Johannesburg
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-gradient-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="h-6 w-6" />
                Community Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{communityTotal.saved.toLocaleString()}L</div>
              <p className="text-sm opacity-90">Total Water Saved This Month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-success text-success-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                Active Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{communityTotal.members}</div>
              <p className="text-sm opacity-90">Contributing to Water Conservation</p>
            </CardContent>
          </Card>
        </div>

        {/* Challenge Badges */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Achievement Badges</CardTitle>
            <CardDescription>Earn badges by saving water and fixing leaks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-4xl mb-2">💧</div>
                <div className="font-semibold">Water Hero</div>
                <div className="text-xs text-muted-foreground">Save 1000L+</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-4xl mb-2">🔧</div>
                <div className="font-semibold">Leak Fixer</div>
                <div className="text-xs text-muted-foreground">Fix 5 leaks</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-4xl mb-2">🌍</div>
                <div className="font-semibold">Eco Warrior</div>
                <div className="text-xs text-muted-foreground">30 day streak</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-4xl mb-2">⭐</div>
                <div className="font-semibold">Top 10</div>
                <div className="text-xs text-muted-foreground">Community rank</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Community Leaderboard
            </CardTitle>
            <CardDescription>Top water conservers in Johannesburg</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((member) => {
                const badge = getBadgeForRank(member.rank);
                const BadgeIcon = badge.icon;

                return (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                      member.rank <= 3 ? "bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20" : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-card">
                        <span className="text-xl font-bold">#{member.rank}</span>
                      </div>
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          {member.profiles?.full_name || "Anonymous"}
                          <BadgeIcon className={`h-4 w-4 ${badge.color}`} />
                        </div>
                        <div className="text-sm text-muted-foreground">{member.profiles?.location || "Johannesburg"}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-success">
                        {Number(member.total_saved_litres || 0).toFixed(0)}L
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {member.leaks_fixed || 0} leaks fixed
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {leaderboard.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No community members yet. Be the first to join!</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button onClick={() => navigate("/")} size="lg" className="bg-gradient-primary">
            View My Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
