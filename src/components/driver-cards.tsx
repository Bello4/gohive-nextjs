import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DriverCards({ summary }) {
  // Add safety checks
  if (!summary) {
    return <div>No summary data available</div>;
  }

  const cards = [
    {
      title: "Total Rides",
      value: summary.total_rides || 0,
      description: "All assigned rides",
      icon: "🚗", // or use Lucide icons
      color: "blue",
    },
    {
      title: "Active Orders",
      value: summary.total_active || 0,
      description: "Currently in progress",
      icon: "🔄",
      color: "orange",
    },
    {
      title: "Completed",
      value: summary.total_completed || 0,
      description: "Successfully delivered",
      icon: "✅",
      color: "green",
    },
    {
      title: "Cancelled",
      value: summary.total_cancelled || 0,
      description: "Cancelled orders",
      icon: "❌",
      color: "red",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 px-4 lg:grid-cols-4 lg:px-6">
      {cards.map((card, index) => (
        <Card key={index} className={`p-3 border-l-4 ${card.color}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.title}</p>
            </div>
            <span className="text-xl">{card.icon}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
