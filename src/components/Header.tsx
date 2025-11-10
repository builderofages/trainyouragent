import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X, Search } from "lucide-react";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  const headerOpacity = useTransform(scrollY, [0, 100], [0.8, 1]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 20]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { 
      name: "Solutions", 
      href: "/solutions",
      submenu: [
        { name: "By Industry", href: "/solutions" },
        { name: "HVAC AI", href: "/niche/hvac" },
        { name: "Accounting AI", href: "/accounting" },
        { name: "Roofing AI", href: "/roofing" },
      ]
    },
    { name: "Demos", href: "/demos" },
    { name: "Resources", href: "/resources" },
    { name: "Integrations", href: "/integrations" },
    { name: "Company", href: "#", 
      submenu: [
        { name: "About", href: "/about" },
        { name: "Team", href: "/team" },
        { name: "Technology", href: "/technology" },
        { name: "Security", href: "/security" },
        { name: "Research", href: "/research" }
      ]
    }
  ];

  return (
    <motion.header
      style={{ opacity: headerOpacity }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "glass-card border-b border-glass-border shadow-dramatic"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-glow-sm"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-white font-black text-xl">T</span>
            </motion.div>
            <span className="text-xl font-black text-gradient group-hover:scale-105 transition-transform">
              TrainYourAgent
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                <a
                  href={link.href}
                  onClick={(e) => {
                    if (link.href.startsWith('#')) {
                      e.preventDefault();
                      const element = document.querySelector(link.href);
                      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="text-foreground hover:text-primary font-medium transition-colors duration-300 flex items-center gap-1"
                >
                  {link.name}
                </a>
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-primary"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            <MagneticButton variant="ghost" size="icon" className="rounded-full" strength={10}>
              <Search className="w-5 h-5" />
            </MagneticButton>
            <MagneticButton 
              variant="outline" 
              className="rounded-full"
              onClick={() => window.open('https://calendly.com/trainyouragent', '_blank')}
            >
              Sign In
            </MagneticButton>
            <MagneticButton 
              className="rounded-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
              onClick={() => window.open('https://calendly.com/trainyouragent', '_blank')}
            >
              Book a Call
            </MagneticButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground hover:text-primary transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-6 space-y-4">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="block text-foreground hover:text-primary font-medium transition-colors"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {link.name}
              </motion.a>
            ))}
            <div className="pt-4 space-y-2">
              <Button 
                variant="outline" 
                className="w-full rounded-full"
                onClick={() => window.open('https://calendly.com/trainyouragent', '_blank')}
              >
                Sign In
              </Button>
              <Button 
                className="w-full rounded-full bg-gradient-primary"
                onClick={() => window.open('https://calendly.com/trainyouragent', '_blank')}
              >
                Book a Call
              </Button>
            </div>
          </div>
        </motion.div>
      </nav>
    </motion.header>
  );
};

export default Header;
