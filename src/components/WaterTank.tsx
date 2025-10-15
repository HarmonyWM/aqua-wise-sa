import { useEffect, useState } from "react";
import { Droplets } from "lucide-react";

interface WaterTankProps {
  currentUsage: number;
  maxCapacity: number;
}

export default function WaterTank({ currentUsage, maxCapacity }: WaterTankProps) {
  const [fillPercentage, setFillPercentage] = useState(0);

  useEffect(() => {
    const percentage = Math.min((currentUsage / maxCapacity) * 100, 100);
    // Animate the fill
    const timer = setTimeout(() => {
      setFillPercentage(percentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentUsage, maxCapacity]);

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="relative h-80 bg-card border-4 border-primary rounded-3xl overflow-hidden shadow-water">
        {/* Water fill with animation */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-primary transition-all duration-1000 ease-out"
          style={{ height: `${fillPercentage}%` }}
        >
          {/* Animated waves */}
          <div className="absolute top-0 left-0 right-0 h-8 overflow-hidden">
            <div className="absolute w-[200%] h-full bg-secondary/30 animate-[wave_3s_ease-in-out_infinite]" 
                 style={{
                   clipPath: "polygon(0 50%, 10% 40%, 20% 50%, 30% 60%, 40% 50%, 50% 40%, 60% 50%, 70% 60%, 80% 50%, 90% 40%, 100% 50%, 100% 100%, 0 100%)"
                 }}
            />
          </div>
        </div>

        {/* Tank measurements */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
          {[100, 75, 50, 25, 0].map((mark) => (
            <div key={mark} className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="bg-card/80 px-2 py-0.5 rounded">{mark}%</span>
              <div className="flex-1 mx-2 border-t border-dashed border-muted-foreground/30" />
            </div>
          ))}
        </div>

        {/* Current level indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-card/95 p-6 rounded-2xl shadow-glow text-center">
            <Droplets className="h-12 w-12 text-primary mx-auto mb-2" />
            <div className="text-3xl font-bold text-primary">{currentUsage.toFixed(0)}L</div>
            <div className="text-sm text-muted-foreground">Today's Usage</div>
            <div className="text-xs text-muted-foreground mt-1">
              {fillPercentage.toFixed(1)}% of daily limit
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        Daily Limit: {maxCapacity}L
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-25%); }
        }
      `}</style>
    </div>
  );
}
