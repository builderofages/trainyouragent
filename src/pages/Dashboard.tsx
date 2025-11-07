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
