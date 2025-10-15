import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Droplets } from "lucide-react";

export default function Tips() {
  const [tips, setTips] = useState<any[]>([]);

  useEffect(() => {
    loadTips();
  }, []);

  const loadTips = async () => {
    const { data } = await supabase
      .from("sustainability_tips")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setTips(data);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      maintenance: "bg-destructive/10 text-destructive",
      conservation: "bg-primary/10 text-primary",
      gardening: "bg-accent/10 text-accent",
      "daily habits": "bg-secondary/10 text-secondary",
      upgrades: "bg-success/10 text-success",
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-primary p-4 rounded-2xl shadow-glow">
              <Droplets className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Water Conservation Tips</h1>
          <p className="text-xl text-muted-foreground">
            Practical advice for sustainable water use in South Africa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip) => (
            <Card key={tip.id} className="hover:shadow-water transition-all hover:scale-[1.02]">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {tip.category && (
                    <Badge className={getCategoryColor(tip.category)}>{tip.category}</Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{tip.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{tip.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {tips.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No tips available yet. Check back soon!</p>
          </div>
        )}

        <Card className="mt-8 bg-gradient-water">
          <CardHeader>
            <CardTitle>Did You Know?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              💧 South Africa is classified as a water-scarce country, with less than 500m³ of water
              available per person per year.
            </p>
            <p>
              💧 A dripping tap can waste up to 20,000 litres of water per year – enough to fill a
              small swimming pool.
            </p>
            <p>
              💧 Fixing leaks early can save households up to 30% on their monthly water bills.
            </p>
            <p>
              💧 Johannesburg loses an estimated 35% of its treated water due to leaks and burst
              pipes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
