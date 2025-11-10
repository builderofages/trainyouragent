import { motion } from "framer-motion";
import { Target, Users, Zap, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { GlassCard } from "@/components/enhanced/GlassCard";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About TrainYourAgent</h1>
            <p className="text-xl text-muted-foreground">
              We're building the future of business communication—one AI agent at a time.
            </p>
          </motion.div>

          <GlassCard className="p-12 mb-12">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Every day, businesses lose millions of dollars to missed calls, slow response times, and manual processes. 
              We believe this is preventable.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              TrainYourAgent exists to help businesses capture every opportunity by deploying AI agents that work 24/7, 
              never miss a lead, and provide perfect consistency. We're not replacing humans—we're amplifying them.
            </p>
          </GlassCard>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[
              { icon: Target, title: "Research-First Approach", desc: "We don't make claims—we cite research from McKinsey, Gartner, and industry leaders." },
              { icon: Users, title: "Customer Success Focus", desc: "Our pilot program ensures you see ROI before fully committing. 94% convert to full implementation." },
              { icon: Zap, title: "Rapid Implementation", desc: "Most businesses are fully live within 3-5 days, compared to industry average of 2-4 weeks." },
              { icon: Shield, title: "Enterprise Security", desc: "Bank-level encryption, SOC 2 compliance, and HIPAA options for healthcare clients." }
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <GlassCard key={index} hover className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.desc}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
