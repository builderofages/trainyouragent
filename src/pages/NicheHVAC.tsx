import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";

const NicheHVAC = () => {
  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      window.location.href = "https://trainyouragentai.com";
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const painPoints = [
    {
      icon: Clock,
      title: "Missing Calls After Hours",
      description: "Lose 60% of leads outside business hours",
      color: "from-red-500 to-orange-500",
    },
    {
      icon: DollarSign,
      title: "High Customer Acquisition Cost",
      description: "Average $300+ per HVAC customer",
      color: "from-yellow-500 to-red-500",
    },
    {
      icon: Users,
      title: "Slow Response Times",
      description: "Customers choose competitors who respond faster",
      color: "from-orange-500 to-red-500",
    },
  ];

  const solutions = [
    {
      icon: CheckCircle,
      title: "24/7 Lead Capture",
      description: "Never miss another customer call",
    },
    {
      icon: CheckCircle,
      title: "Instant Qualification",
      description: "Pre-qualify leads automatically",
    },
    {
      icon: CheckCircle,
      title: "Smart Scheduling",
      description: "Book appointments while you sleep",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Redirect Notice */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-4 bg-primary/10 border-primary">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-primary" />
                <p className="text-sm">
                  Redirecting to our dedicated HVAC solution site in 5 seconds...
                </p>
                <Button
                  size="sm"
                  onClick={() =>
                    (window.location.href = "https://trainyouragentai.com")
                  }
                  className="ml-auto gap-2"
                >
                  Go Now <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              AI Agents for{" "}
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                HVAC Businesses
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Capture leads 24/7, qualify customers instantly, and book
              appointments automatically — while you focus on the work.
            </p>
          </motion.div>

          {/* Pain Points */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-10">
              The HVAC Lead Problem
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {painPoints.map((point, index) => {
                const Icon = point.icon;
                return (
                  <motion.div
                    key={point.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="p-6 h-full border-red-500/20 bg-red-500/5">
                      <div
                        className={`w-14 h-14 rounded-lg bg-gradient-to-br ${point.color} flex items-center justify-center mb-4`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{point.title}</h3>
                      <p className="text-muted-foreground">{point.description}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Solution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16"
          >
            <Card className="p-12 bg-gradient-to-br from-primary/10 to-blue-500/10 border-primary/20">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-4">
                  Your AI-Powered Solution
                </h2>
                <p className="text-xl text-muted-foreground">
                  Turn every inquiry into a qualified lead, automatically
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {solutions.map((solution) => {
                  const Icon = solution.icon;
                  return (
                    <div
                      key={solution.title}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-bold mb-2">{solution.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {solution.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  onClick={() =>
                    (window.location.href = "https://trainyouragentai.com")
                  }
                  className="gap-2"
                >
                  Learn More at TrainYourAgentAI.com
                  <ExternalLink className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { value: "3x", label: "More Leads Captured" },
              { value: "60%", label: "Lower CAC" },
              { value: "24/7", label: "Customer Coverage" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              >
                <Card className="p-8 text-center">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NicheHVAC;
