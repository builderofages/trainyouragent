import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const plans = [
  {
    name: "Starter",
    subtitle: "For growing businesses",
    price: 497,
    setup: 1500,
    features: [
      "200 calls/month",
      "1 phone line",
      "Standard voice",
      "Calendar sync",
      "Email alerts",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Growth",
    subtitle: "For established ops",
    price: 997,
    setup: 2500,
    features: [
      "500 calls/month",
      "3 phone lines",
      "Premium voice",
      "CRM integration",
      "SMS alerts",
      "Priority support",
      "Monthly optimization",
    ],
    popular: true,
  },
  {
    name: "Scale",
    subtitle: "For high-volume",
    price: 1497,
    setup: 3500,
    features: [
      "Unlimited calls",
      "Unlimited lines",
      "Custom voice",
      "All integrations",
      "Real-time dashboard",
      "Dedicated CSM",
      "Weekly calls",
    ],
    popular: false,
  },
];

export const PricingDark = () => {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  return (
    <section id="pricing-section" className="relative py-24 md:py-32 bg-white overflow-hidden">
      {/* Grain texture */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Tag */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-tech-cyan text-sm font-semibold tracking-widest uppercase">
            Transparent Pricing
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="text-4xl md:text-5xl font-black text-white text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Simple Pricing. Serious ROI.
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          className="text-lg text-slate-700 text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          No hidden fees. No long-term contracts. No BS.
        </motion.p>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-2xl p-8 transition-all duration-300
                        ${plan.popular 
                          ? "bg-white/10 border-2 border-tech-cyan/50 scale-105 z-10" 
                          : "bg-white/5 border border-[#042C53]/10"
                        }
                        ${hoveredPlan === index ? "shadow-[0_0_60px_hsla(185,80%,50%,0.3)]" : ""}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + index * 0.1 }}
              onMouseEnter={() => setHoveredPlan(index)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-tech-cyan text-deep-space text-xs font-bold rounded-full">
                  ★ MOST POPULAR
                </div>
              )}

              {/* Plan name */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-slate-700 text-sm">{plan.subtitle}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <span className="text-5xl font-black text-white">${plan.price}</span>
                <span className="text-slate-700">/month</span>
              </div>

              <div className="w-full h-px bg-white/10 mb-6" />

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-700">
                    <Check className="w-4 h-4 text-tech-cyan shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="w-full h-px bg-white/10 mb-6" />

              {/* Setup fee */}
              <p className="text-center text-slate-700 text-sm mb-6">
                + ${plan.setup.toLocaleString()} setup
              </p>

              {/* CTA */}
              <Button
                className={`w-full font-semibold ${
                  plan.popular
                    ? "bg-tech-cyan text-deep-space hover:bg-tech-cyan/90"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
                onClick={() => window.open(siteConfig.bookingUrl, "_blank")}
              >
                Book the build call → live in 21 days
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-slate-700 mb-4">
            Need enterprise features? Multi-location management? Custom builds?
          </p>
          <button
            onClick={() => window.open(siteConfig.bookingUrl, "_blank")}
            className="text-tech-cyan font-semibold hover:underline"
          >
            Scope your custom Scale build → 30-min architecture call →
          </button>
        </motion.div>

        {/* Price anchor */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-slate-700 text-sm">
            That's less than <span className="text-white">$17/day</span>. Your receptionist costs <span className="text-white">$150/day</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
