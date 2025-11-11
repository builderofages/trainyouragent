import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import {
  BarChart3,
  MessageSquare,
  TrendingUp,
  Users,
  Plus,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [agents] = useState([
    {
      name: "HVAC Lead Agent",
      niche: "HVAC",
      status: "active",
      conversations: 1247,
      leads: 89,
      color: "from-blue-500 to-cyan-500",
    },
  ]);

  const stats = [
    {
      label: "Total Conversations",
      value: "1,247",
      change: "+12.5%",
      icon: MessageSquare,
    },
    {
      label: "Qualified Leads",
      value: "89",
      change: "+23.1%",
      icon: Users,
    },
    {
      label: "Conversion Rate",
      value: "7.1%",
      change: "+2.3%",
      icon: TrendingUp,
    },
    {
      label: "Active Agents",
      value: "1",
      change: "—",
      icon: BarChart3,
    },
  ];

  const timelineEstimatorStats = {
    starts: 342,
    completions: 187,
    bookings: 43,
    conversionRate: 23.0,
    avgComplexity: 4.2,
    topIndustries: [
      { name: "HVAC", count: 67, avgDays: 3.8 },
      { name: "Legal", count: 54, avgDays: 5.2 },
      { name: "Healthcare", count: 41, avgDays: 4.5 },
      { name: "Accounting", count: 38, avgDays: 4.8 },
      { name: "Roofing", count: 31, avgDays: 4.1 },
    ],
    dropoffRates: [
      { question: "Industry", dropoff: 8 },
      { question: "Services", dropoff: 12 },
      { question: "Integrations", dropoff: 18 },
      { question: "Terminology", dropoff: 15 },
      { question: "Pricing", dropoff: 22 },
      { question: "Feedback Speed", dropoff: 25 },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your AI agents across all niches
              </p>
            </div>
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Add Agent
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      {stat.change !== "—" && (
                        <span className="text-sm text-green-500 font-semibold">
                          {stat.change}
                        </span>
                      )}
                    </div>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Active Agents */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Your Active Agents</h2>
            <div className="space-y-4">
              {agents.map((agent) => (
                <div
                  key={agent.name}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center text-white font-bold`}
                    >
                      {agent.niche.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{agent.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {agent.niche} Industry
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="font-semibold">
                        {agent.conversations.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Conversations
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{agent.leads}</div>
                      <div className="text-sm text-muted-foreground">Leads</div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Settings className="w-4 h-4" />
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Timeline Estimator Analytics */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Timeline Estimator Performance</h2>
            
            {/* Conversion Funnel */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Started</div>
                <div className="text-2xl font-bold">{timelineEstimatorStats.starts}</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Completed</div>
                <div className="text-2xl font-bold">{timelineEstimatorStats.completions}</div>
                <div className="text-xs text-green-500 font-semibold">
                  {((timelineEstimatorStats.completions / timelineEstimatorStats.starts) * 100).toFixed(1)}%
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Calls Booked</div>
                <div className="text-2xl font-bold">{timelineEstimatorStats.bookings}</div>
                <div className="text-xs text-green-500 font-semibold">
                  {((timelineEstimatorStats.bookings / timelineEstimatorStats.completions) * 100).toFixed(1)}%
                </div>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border-2 border-primary/30">
                <div className="text-sm text-muted-foreground mb-1">Overall CVR</div>
                <div className="text-2xl font-bold text-primary">{timelineEstimatorStats.conversionRate}%</div>
              </div>
            </div>

            {/* Industry Insights */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4">Top Industries</h3>
              <div className="space-y-3">
                {timelineEstimatorStats.topIndustries.map((industry, idx) => (
                  <div key={industry.name} className="flex items-center gap-4">
                    <div className="w-8 text-sm font-bold text-muted-foreground">#{idx + 1}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{industry.name}</span>
                        <span className="text-sm text-muted-foreground">{industry.count} uses</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(industry.count / timelineEstimatorStats.topIndustries[0].count) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground w-20 text-right">
                      Avg {industry.avgDays}d
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Question Drop-off Analysis */}
            <div>
              <h3 className="font-semibold mb-4">Question Drop-off Rates</h3>
              <div className="space-y-2">
                {timelineEstimatorStats.dropoffRates.map((item) => (
                  <div key={item.question} className="flex items-center gap-4">
                    <div className="w-32 text-sm text-muted-foreground">{item.question}</div>
                    <div className="flex-1">
                      <div className="h-6 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full flex items-center justify-end px-2 text-xs font-semibold ${
                            item.dropoff < 15 ? 'bg-green-500' : item.dropoff < 20 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${item.dropoff}%` }}
                        >
                          {item.dropoff}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Lower drop-off rates indicate better question flow and user engagement
              </p>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Plus className="w-6 h-6" />
                <span>Add New Niche</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <BarChart3 className="w-6 h-6" />
                <span>View Analytics</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Settings className="w-6 h-6" />
                <span>Agent Settings</span>
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
