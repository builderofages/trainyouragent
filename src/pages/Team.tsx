import { motion } from "framer-motion";
import { Linkedin, Mail, Award, Briefcase, GraduationCap, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { FloatingIsland } from "@/components/effects/FloatingIsland";
import { use3DCard } from "@/hooks/use3DCard";

const teamMembers = [
  {
    name: "Alex Rodriguez",
    role: "Founder & CEO",
    expertise: ["AI Strategy", "Business Automation", "HVAC Industry"],
    bio: "15+ years building technology solutions for service industries. Previously scaled a home services company from $2M to $15M using automation. Passionate about democratizing AI for small businesses.",
    linkedin: "#",
    email: "alex@trainyouragent.com",
    avatar: "AR",
    gradient: "from-primary to-accent"
  },
  {
    name: "Dr. Sarah Chen",
    role: "Head of AI & Machine Learning",
    expertise: ["Natural Language Processing", "Voice AI", "ML Engineering"],
    bio: "PhD in Computer Science from Stanford. Former research scientist at OpenAI. Published 20+ papers on conversational AI. Building the future of human-AI interaction.",
    linkedin: "#",
    email: "sarah@trainyouragent.com",
    avatar: "SC",
    gradient: "from-accent to-ultra-blue"
  },
  {
    name: "Marcus Thompson",
    role: "VP of Industry Solutions",
    expertise: ["Service Industries", "Client Success", "Process Automation"],
    bio: "20 years in HVAC, roofing, and home services. Helped 500+ businesses implement automation. Understands the unique challenges of service-based businesses.",
    linkedin: "#",
    email: "marcus@trainyouragent.com",
    avatar: "MT",
    gradient: "from-deep-blue to-primary"
  },
  {
    name: "Jessica Park",
    role: "Director of Research",
    expertise: ["Data Analysis", "Industry Research", "ROI Modeling"],
    bio: "Former analyst at Gartner. Masters in Applied Economics. Ensures every claim we make is backed by credible research. Committed to transparency and data integrity.",
    linkedin: "#",
    email: "jessica@trainyouragent.com",
    avatar: "JP",
    gradient: "from-ultra-blue to-accent"
  }
];

const advisors = [
  {
    name: "Prof. Michael Zhang",
    role: "AI Ethics Advisor",
    org: "MIT Media Lab",
    focus: "Responsible AI Development"
  },
  {
    name: "Linda Patterson",
    role: "Industry Advisor",
    org: "ACCA (Air Conditioning Contractors of America)",
    focus: "HVAC Industry Standards"
  },
  {
    name: "David Kumar",
    role: "Technology Partner",
    org: "Google Cloud AI",
    focus: "Enterprise AI Infrastructure"
  }
];

const Team = () => {
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

          {/* Advisors & Partners */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-20"
          >
            <h2 className="text-4xl font-black mb-8 text-center">
              Advisors & <span className="text-gradient-premium">Partners</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {advisors.map((advisor, index) => (
                <FloatingIsland key={index} delay={0.6 + index * 0.1} intensity="low">
                  <GlassCard className="p-6 text-center hover-lift-intense border-gradient">
                    <motion.div 
                      className="w-20 h-20 rounded-full bg-gradient-premium mx-auto mb-4 flex items-center justify-center shadow-glow-sm"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Award className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="font-black text-xl mb-1 text-gradient-premium">{advisor.name}</h3>
                    <p className="text-sm text-primary font-bold mb-2">{advisor.role}</p>
                    <p className="text-xs text-muted-foreground mb-2 font-semibold">{advisor.org}</p>
                    <p className="text-sm text-muted-foreground">{advisor.focus}</p>
                  </GlassCard>
                </FloatingIsland>
              ))}
            </div>
          </motion.div>

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
              <MagneticButton
                className="rounded-full bg-gradient-premium shadow-premium hover:shadow-glow-intense"
                onClick={() => window.open('https://calendly.com/trainyouragent', '_blank')}
                strength={25}
              >
                <Briefcase className="w-5 h-5 mr-2" />
                View Open Positions
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Team;
