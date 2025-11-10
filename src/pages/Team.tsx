import { motion } from "framer-motion";
import { Linkedin, Mail, Award, Briefcase, GraduationCap, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/FooterEnhanced";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { MagneticButton } from "@/components/enhanced/MagneticButton";

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
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient">
              Building the Future of Business Automation
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're a team of AI researchers, industry veterans, and automation experts on a mission to make enterprise-grade AI accessible to every business.
            </p>
          </motion.div>

          {/* Team Members Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-8 hover-lift h-full">
                  <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center flex-shrink-0 shadow-glow-sm`}>
                      <span className="text-2xl font-black text-white">{member.avatar}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                      <p className="text-primary font-semibold mb-3">{member.role}</p>
                      
                      {/* Expertise Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {member.expertise.map((skill, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
                          >
                            {skill}
                          </span>
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
                          className="rounded-full"
                          onClick={() => window.open(member.linkedin, '_blank')}
                        >
                          <Linkedin className="w-4 h-4" />
                        </MagneticButton>
                        <MagneticButton
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() => window.location.href = `mailto:${member.email}`}
                        >
                          <Mail className="w-4 h-4" />
                        </MagneticButton>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Advisors & Partners */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Advisors & Partners</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {advisors.map((advisor, index) => (
                <GlassCard key={index} className="p-6 text-center hover-lift">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{advisor.name}</h3>
                  <p className="text-sm text-primary font-semibold mb-2">{advisor.role}</p>
                  <p className="text-xs text-muted-foreground mb-2">{advisor.org}</p>
                  <p className="text-sm text-muted-foreground">{advisor.focus}</p>
                </GlassCard>
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
            <Briefcase className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Join Our Growing Team</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're always looking for talented people who are passionate about AI and helping small businesses succeed. If you're interested in joining our mission, we'd love to hear from you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <MagneticButton
                variant="outline"
                className="rounded-full"
                onClick={() => window.location.href = 'mailto:careers@trainyouragent.com'}
              >
                <Mail className="w-5 h-5 mr-2" />
                careers@trainyouragent.com
              </MagneticButton>
              <MagneticButton
                className="rounded-full bg-gradient-primary"
                onClick={() => window.open('https://calendly.com/trainyouragent', '_blank')}
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
