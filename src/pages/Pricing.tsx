import { Check, Zap, Building2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$97",
      period: "/month",
      description: "Perfect for testing one niche",
      features: [
        "1 AI Agent (choose your niche)",
        "Up to 1,000 conversations/month",
        "Basic analytics dashboard",
        "Email support",
        "Standard integrations",
      ],
      icon: Zap,
      color: "from-blue-500 to-cyan-500",
      popular: false,
    },
    {
      name: "Professional",
      price: "$297",
      period: "/month",
      description: "Scale across 3 niches",
      features: [
        "3 AI Agents (mix & match niches)",
        "Up to 10,000 conversations/month",
        "Advanced analytics & insights",
        "Priority support",
        "All integrations included",
        "Custom agent training",
        "White-label option",
      ],
      icon: Building2,
      color: "from-primary to-blue-600",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Unlimited niches, full control",
      features: [
        "Unlimited AI Agents",
        "Unlimited conversations",
        "Dedicated success manager",
        "24/7 priority support",
        "Custom integrations & APIs",
        "Advanced security & compliance",
        "Multi-team management",
        "Custom SLAs",
      ],
      icon: Sparkles,
      color: "from-purple-500 to-pink-500",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Simple, Transparent{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start with one niche, scale to many. Cancel anytime.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card
                    className={`relative p-8 h-full ${
                      plan.popular
                        ? "border-primary shadow-xl shadow-primary/20 scale-105"
                        : "border-border"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground mb-4">
                      {plan.description}
                    </p>

                    <div className="mb-6">
                      <span className="text-5xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground ml-1">
                        {plan.period}
                      </span>
                    </div>

                    <Button
                      className={`w-full mb-6 ${
                        plan.popular
                          ? "bg-primary hover:bg-primary/90"
                          : "bg-secondary hover:bg-secondary/90"
                      }`}
                      size="lg"
                    >
                      {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                    </Button>

                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Bundle Offer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-primary/10 to-blue-500/10 border-primary/20">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-3">
                  Multi-Niche Bundle Discount
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Save 20% when you add 2+ niches to any plan
                </p>
                <Button size="lg" variant="default">
                  View Bundle Options
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
