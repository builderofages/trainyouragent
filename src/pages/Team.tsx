import { useState } from "react";
import { motion } from "framer-motion";
import { Linkedin, Mail, Award, Briefcase, GraduationCap, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { StrategySessionLeadGate } from "@/components/conversion/StrategySessionLeadGate";
import { FloatingIsland } from "@/components/effects/FloatingIsland";
import { use3DCard } from "@/hooks/use3DCard";

const teamMembers = [
  {
    name: "Alexander",
    role: "Founder & CEO",
    expertise: ["AI Strategy", "Business Transformation", "American Innovation"],
    bio: "Spent most of adult life across B2B/B2C markets. Former Head Executive at major SMMA leading 10+ departments with 1,000+ employees, helping brands achieve millions in sales. Leads non-profit training service dogs. Early AI adopter and ChatGPT beta tester. Founded TrainYourAgent to help American businesses harness AI for sustainable growth while proving automation elevates employees rather than replacing them.",
    linkedin: "https://www.linkedin.com/in/alexander-trainyouragent",
    email: "alexander@trainyouragent.com",
    avatar: "A",
    gradient: "from-primary to-accent"
  },
  {
    name: "Jess",
    role: "CRM & Operations Lead",
    expertise: ["Salesforce CRM", "Customer Experience", "Brand Management"],
    bio: "5+ years at Fortune 500 communications company (billions in revenue) leading brand management and high-level customer experience. Expert in Salesforce optimization, lead scoring, and conversion funnels. Also serves as Creative Director for brand assets and UI/UX. Brings Fortune 500 methodology to SMB automation.",
    linkedin: "#",
    email: "jess@trainyouragent.com",
    avatar: "J",
    gradient: "from-accent to-primary"
  },
  {
    name: "Daniel",
    role: "Head of Sales",
    expertise: ["Strategic Sales", "AI Integration", "Economic Markets"],
    bio: "5+ years across multiple B2B/B2C markets. Built automated system generating $60K+/month. Specializes in economic markets, strategic sales methodology, and client psychology. Focused on AI space integration across all niches, delivering turn-key systems that help businesses understand AI as optimization tool rather than replacement.",
    linkedin: "#",
    email: "daniel@trainyouragent.com",
    avatar: "D",
    gradient: "from-primary to-ultra-blue"
  },
  {
    name: "David",
    role: "Head of Development / CTO",
    expertise: ["AI/ML Integration", "Full-Stack Development", "Prompt Engineering"],
    bio: "10+ years building games, enterprise websites, SaaS platforms, and AI applications. Deep expertise in AI/ML integration, prompt engineering, and LLM orchestration. Leads 5-person dev team with diverse backgrounds. Shares Alexander's passion for ethical AI that elevates human capabilities. Ensures every solution is built with security, scalability, and reliability at core.",
    linkedin: "#",
    email: "david@trainyouragent.com",
    avatar: "D",
    gradient: "from-deep-blue to-primary"
  }
];

const Team = () => {
  const [leadGateOpen, setLeadGateOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Meet the Team</span>
            </div>
            <h1 className="text-hero mb-6">
              Building the Future of <span className="text-gradient-premium">Business Automation</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're a team of AI researchers, industry veterans, and automation experts on a mission to make enterprise-grade AI accessible to every business.
            </p>
          </motion.div>

          {/* Team Members Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {teamMembers.map((member, index) => {
              const { ref, style, onMouseMove, onMouseLeave } = use3DCard(8);
              
              return (
                <FloatingIsland key={index} delay={index * 0.1} intensity="low">
                  <motion.div
                    ref={ref as any}
                    style={style}
                    onMouseMove={onMouseMove}
                    onMouseLeave={onMouseLeave}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="perspective-1000"
                  >
                    <GlassCard className="p-8 hover-lift-intense h-full border-gradient relative overflow-hidden group">
                      <motion.div
                        className="absolute inset-0 bg-gradient-premium opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                      />
                      
                      <div className="flex items-start gap-6 relative z-10">
                        {/* Avatar */}
                        <motion.div 
                          className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center flex-shrink-0 shadow-glow-sm`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <span className="text-3xl font-black text-white">{member.avatar}</span>
                        </motion.div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="text-2xl font-black mb-1 text-gradient-premium">{member.name}</h3>
                          <p className="text-primary font-bold mb-4">{member.role}</p>
                          
                          {/* Expertise Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {member.expertise.map((skill, i) => (
                              <motion.span
                                key={i}
                                whileHover={{ scale: 1.1 }}
                                className="px-3 py-1 text-xs font-bold rounded-full bg-primary/10 text-primary border border-primary/20 shadow-glow-sm"
                              >
                                {skill}
                              </motion.span>
                            ))}
                          </div>

                          {/* Bio */}
                          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                            {member.bio}
                          </p>

                          {/* Contact */}
                          <div className="flex gap-3">
                            <MagneticButton
                              variant="outline"
                              size="sm"
                              className="rounded-full border-gradient"
                              onClick={() => window.open(member.linkedin, '_blank')}
                              strength={20}
                            >
                              <Linkedin className="w-4 h-4" />
                            </MagneticButton>
                            <MagneticButton
                              variant="outline"
                              size="sm"
                              className="rounded-full border-gradient"
                              onClick={() => window.location.href = `mailto:${member.email}`}
                              strength={20}
                            >
                              <Mail className="w-4 h-4" />
                            </MagneticButton>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                </FloatingIsland>
              );
            })}
          </div>

          {/* Join Us Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-12 rounded-3xl text-center"
          >
            <Briefcase className="w-20 h-20 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-black mb-4">
              Join Our <span className="text-gradient-premium">Growing Team</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're always looking for talented people who are passionate about AI and helping small businesses succeed. If you're interested in joining our mission, we'd love to hear from you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <MagneticButton
                variant="outline"
                className="rounded-full border-gradient"
                onClick={() => window.location.href = 'mailto:careers@trainyouragent.com'}
                strength={25}
              >
                <Mail className="w-5 h-5 mr-2" />
                careers@trainyouragent.com
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      <StrategySessionLeadGate open={leadGateOpen} onOpenChange={setLeadGateOpen} />

      <Footer />
    </div>
  );
};

export default Team;
