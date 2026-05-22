import { motion } from "framer-motion";
import { ArrowUp, Twitter, Linkedin, Instagram } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerSections = [
    {
      title: "Solutions",
      links: [
        { name: "Accounting AI", href: "/accounting" },
        { name: "Roofing AI", href: "/roofing" },
        { name: "Legal AI", href: "/legal" },
        { name: "Healthcare AI", href: "/healthcare" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", href: "/resources" },
        { name: "Case Studies", href: "/case-studies" },
        { name: "Demos", href: "/demos" },
        { name: "Calculators", href: "/calculators" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Technology", href: "/technology" },
        { name: "Contact", href: `mailto:${siteConfig.email}` },
        { name: "Research", href: "/research" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy", href: "/privacy" },
        { name: "Terms", href: "/terms" },
        { name: "Security", href: "/security" },
        { name: "Cookies", href: "/cookie-policy" },
      ],
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-b from-white to-secondary py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
      
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
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-blue">
                  <span className="text-white font-black text-xl">T</span>
                </div>
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
                  { Icon: Twitter, href: siteConfig.socialMedia.twitter },
                  { Icon: Linkedin, href: siteConfig.socialMedia.linkedin },
                  { Icon: Instagram, href: siteConfig.socialMedia.instagram },
                ].map(({ Icon, href }, index) => (
                  <motion.a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300 shadow-sm hover:shadow-blue"
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
                    {link.href.startsWith('mailto:') ? (
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm inline-block relative group"
                      >
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm inline-block relative group"
                      >
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 TrainYourAgent LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse-slow" />
              Part of the AI Agent Ecosystem
            </span>
          </div>
        </div>

        {/* Back to Top Button */}
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white shadow-blue hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      </div>
    </footer>
  );
};

export default Footer;
