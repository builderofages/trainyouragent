import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X, Search } from "lucide-react";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { Button } from "@/components/ui/button";
import { SearchModal } from "./SearchModal";
import { ClickToCall } from "./ClickToCall";
import { siteConfig } from "@/config/site";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { scrollY } = useScroll();
  
  const headerOpacity = useTransform(scrollY, [0, 100], [0.8, 1]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const navLinks = [
    { name: "Solutions", href: "/solutions" },
    { name: "Demos", href: "/demos" },
    { name: "Resources", href: "/resources" },
    { name: "Comparisons", href: "/comparisons" },
    { name: "About", href: "/about" }
  ];

  return (
    <>
      <motion.header
        style={{ opacity: headerOpacity }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "glass-card border-b border-glass-border shadow-dramatic" : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.a href="/" className="flex items-center gap-3 group" whileHover={{ scale: 1.05 }}>
              <motion.div className="w-10 h-10 rounded-lg overflow-hidden shadow-glow-sm" whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                <img src={logo} alt="TrainYourAgent Logo" className="w-full h-full object-contain" />
              </motion.div>
              <span className="text-xl font-black text-gradient">TrainYourAgent</span>
            </motion.a>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-foreground hover:text-primary font-medium transition-colors">{link.name}</a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              {siteConfig.phoneNumber && (
                <ClickToCall 
                  variant="ghost" 
                  trackingLocation="header"
                  className="rounded-full"
                />
              )}
              <MagneticButton variant="ghost" size="icon" className="rounded-full" onClick={() => setSearchOpen(true)}>
                <Search className="w-5 h-5" />
              </MagneticButton>
              <MagneticButton className="rounded-full bg-gradient-primary" onClick={() => window.open('https://calendly.com/trainyouragent', '_blank')}>Get Your Free Strategy Session</MagneticButton>
            </div>

            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }} className="md:hidden overflow-hidden">
            <div className="py-6 space-y-4">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="block text-foreground hover:text-primary font-medium">{link.name}</a>
              ))}
              {siteConfig.phoneNumber && (
                <ClickToCall 
                  variant="outline"
                  trackingLocation="header_mobile"
                  className="w-full rounded-full"
                />
              )}
              <Button className="w-full rounded-full bg-gradient-primary" onClick={() => window.open('https://calendly.com/trainyouragent', '_blank')}>Get Your Free Strategy Session</Button>
            </div>
          </motion.div>
        </nav>
      </motion.header>
      
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};

export default Header;
