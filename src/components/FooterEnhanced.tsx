import { motion } from "framer-motion";
import { ArrowUp, Twitter, Linkedin, Instagram } from "lucide-react";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import logo from "@/assets/logo.png";

const Footer = () => {
  const footerSections = [
    {
      title: "Solutions",
      links: [
        { name: "By Industry", href: "/solutions" },
        { name: "HVAC AI", href: "/niche/hvac" },
        { name: "Accounting AI", href: "/accounting" },
        { name: "Roofing AI", href: "/roofing" },
        { name: "Legal AI", href: "/legal" },
        { name: "Healthcare AI", href: "/healthcare" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Blog & Research", href: "/resources" },
        { name: "Demos & Calculators", href: "/demos" },
        { name: "Research Partners", href: "/research" },
        { name: "Book a Call", href: "https://calendly.com/trainyouragent" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Our Team", href: "/team" },
        { name: "Technology", href: "/technology" },
        { name: "Security", href: "/security" },
        { name: "Integrations", href: "/integrations" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Security & Compliance", href: "/security" },
      ],
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-b from-background to-muted/30 py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-[0.03]" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-10 h-10 rounded-lg overflow-hidden shadow-glow-sm"
                >
                  <img src={logo} alt="TrainYourAgent Logo" className="w-full h-full object-contain" />
                </motion.div>
                <span className="text-xl font-black text-foreground">
                  TrainYourAgent
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                Empowering businesses with custom AI agents that automate operations, 
                amplify productivity, and unlock exponential growth.
              </p>
              <div className="flex gap-4">
                {[
                  { Icon: Twitter, href: "https://x.com/trainyouragent", label: "Twitter" },
                  { Icon: Instagram, href: "https://www.instagram.com/trainyouragent", label: "Instagram" },
                  { Icon: Linkedin, href: "https://www.linkedin.com/company/train-your-agent/", label: "LinkedIn" }
                ].map(({ Icon, href, label }, index) => (
                  <motion.a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full glass-card border border-glass-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300 shadow-sm hover:shadow-glow-sm"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <h3 className="font-bold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      whileHover={{ x: 5 }}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm inline-block relative group"
                    >
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-glass-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 TrainYourAgent. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-primary rounded-full shadow-glow-sm"
              />
              Part of the AI Agent Ecosystem
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
