import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LeakDetectorProps {
  userId: string | undefined;
}

export default function LeakDetector({ userId }: LeakDetectorProps) {
  const [flowRate, setFlowRate] = useState(0);
  const [isLeakDetected, setIsLeakDetected] = useState(false);
  const [leakHistory, setLeakHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;

    // Simulate IoT sensor data every 5 seconds
    const interval = setInterval(() => {
      // Normal flow rate between 0-15 L/min
      // Occasional spike to simulate leak
      const random = Math.random();
      let newFlowRate = 0;

      if (random < 0.85) {
        // Normal usage (daytime)
        newFlowRate = Math.random() * 15;
      } else if (random < 0.95) {
        // Nighttime low usage
        newFlowRate = Math.random() * 3;
      } else {
        // Leak detected! Abnormal continuous flow
        newFlowRate = 25 + Math.random() * 15;
      }

      setFlowRate(newFlowRate);

      // Detect leak: flow rate > 20 L/min is considered abnormal
      if (newFlowRate > 20 && !isLeakDetected) {
        setIsLeakDetected(true);
        
        // Save leak detection to database
        supabase
          .from("leak_detections")
          .insert({
            user_id: userId,
            flow_rate: newFlowRate,
            status: "active",
          })
          .then(({ error }) => {
            if (!error) {
              toast.error("🚨 Leak Detected!", {
                description: `Abnormal flow detected: ${newFlowRate.toFixed(1)} L/min`,
              });
            }
          });

        loadLeakHistory();
      } else if (newFlowRate <= 20 && isLeakDetected) {
        setIsLeakDetected(false);
      }
    }, 5000);

    loadLeakHistory();

    return () => clearInterval(interval);
  }, [userId, isLeakDetected]);

  const loadLeakHistory = async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("leak_detections")
      .select("*")
      .eq("user_id", userId)
      .order("detected_at", { ascending: false })
      .limit(5);
    
    if (data) setLeakHistory(data);
  };

  const markAsFixed = async (leakId: string) => {
    if (!userId) return;

    // Get the leak details to calculate water saved
    const { data: leakData } = await supabase
      .from("leak_detections")
      .select("*")
      .eq("id", leakId)
      .single();

    if (!leakData) return;

    // Calculate water saved (estimate based on leak duration and flow rate)
    const detectedTime = new Date(leakData.detected_at).getTime();
    const fixedTime = Date.now();
    const durationHours = (fixedTime - detectedTime) / (1000 * 60 * 60);
    const waterSaved = Math.round(leakData.flow_rate * 60 * durationHours * 0.3); // 30% of potential waste prevented

    // Update leak status
    const { error } = await supabase
      .from("leak_detections")
      .update({ status: "fixed", fixed_at: new Date().toISOString() })
      .eq("id", leakId);

    if (!error) {
      // Update community stats
      const { data: currentStats } = await supabase
        .from("community_stats")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (currentStats) {
        await supabase
          .from("community_stats")
          .update({
            leaks_fixed: (currentStats.leaks_fixed || 0) + 1,
            total_saved_litres: (Number(currentStats.total_saved_litres) || 0) + waterSaved,
          })
          .eq("user_id", userId);
      }

      toast.success(`Leak fixed! You saved ${waterSaved}L of water 💧`);
      loadLeakHistory();
    }
  };

  return (
    <Card className={isLeakDetected ? "border-destructive shadow-glow" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Live Flow Monitor
        </CardTitle>
        <CardDescription>Real-time IoT sensor simulation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{flowRate.toFixed(1)} L/min</div>
              <div className="text-sm text-muted-foreground">Current Flow Rate</div>
            </div>
            <div className={`text-4xl ${isLeakDetected ? "animate-pulse" : ""}`}>
              {isLeakDetected ? (
                <AlertTriangle className="h-12 w-12 text-destructive" />
              ) : (
                <CheckCircle className="h-12 w-12 text-success" />
              )}
            </div>
          </div>

          {isLeakDetected && (
            <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg">
              <div className="font-bold">⚠️ LEAK ALERT</div>
              <div className="text-sm">Abnormal flow detected. Please check your pipes immediately.</div>
            </div>
          )}

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Recent Detections</h4>
            {leakHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground">No leaks detected yet</p>
            ) : (
              <div className="space-y-2">
                {leakHistory.map((leak) => (
                  <div key={leak.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="text-sm">
                      <div className="font-medium">{leak.flow_rate.toFixed(1)} L/min</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(leak.detected_at).toLocaleString()}
                      </div>
                    </div>
                    {leak.status === "active" ? (
                      <Button size="sm" onClick={() => markAsFixed(leak.id)}>
                        Mark Fixed
                      </Button>
                    ) : (
                      <span className="text-sm text-success flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Fixed
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
