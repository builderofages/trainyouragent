import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Menu, X, Search } from "lucide-react";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { Button } from "@/components/ui/button";
import { SearchModal } from "./SearchModal";
import { ClickToCall } from "./ClickToCall";
import { StrategySessionLeadGate } from "./conversion/StrategySessionLeadGate";
import { siteConfig } from "@/config/site";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [leadGateOpen, setLeadGateOpen] = useState(false);
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { name: "Solutions", href: "/solutions" },
    { name: "Demos", href: "/demos" },
    { name: "Resources", href: "/resources" },
    { name: "Comparisons", href: "/comparisons" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <>
      <motion.header
        style={{ opacity: headerOpacity }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-deep-space/95 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" 
            : "bg-gradient-to-b from-deep-space/80 via-deep-space/40 to-transparent backdrop-blur-sm"
        }`}
      >
        {/* Subtle animated gradient line at top */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-tech-cyan/50 to-transparent" />
        
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <motion.a 
              href="/" 
              className="flex items-center gap-3 group flex-shrink-0" 
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="relative w-9 h-9 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {/* Subtle glow on hover */}
                <motion.div
                  className="absolute inset-0 bg-tech-cyan/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <img
                  src={logo}
                  alt="TrainYourAgent"
                  className="relative w-8 h-8 object-contain drop-shadow-[0_0_8px_hsla(185,80%,50%,0.3)]"
                />
              </motion.div>
              <span className="text-lg font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent whitespace-nowrap">
                TrainYourAgent
              </span>
            </motion.a>

            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="relative text-white/70 hover:text-white font-medium transition-all duration-300 py-2
                           after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] 
                           after:bg-gradient-to-r after:from-tech-cyan after:to-primary
                           after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {siteConfig.phoneNumber && (
                <ClickToCall 
                  variant="ghost" 
                  trackingLocation="header"
                  className="rounded-full text-white/70 hover:text-white hover:bg-white/10"
                />
              )}
              <MagneticButton 
                variant="ghost" 
                size="icon" 
                className="rounded-full text-white/70 hover:text-white hover:bg-white/10" 
                onClick={() => setSearchOpen(true)}
              >
                <Search className="w-5 h-5" />
              </MagneticButton>
              <MagneticButton 
                className="relative rounded-full text-sm lg:text-base px-5 lg:px-6 py-2.5
                         bg-gradient-to-r from-tech-cyan to-primary text-deep-space font-semibold
                         shadow-[0_0_20px_hsla(185,80%,50%,0.3)] hover:shadow-[0_0_30px_hsla(185,80%,50%,0.5)]
                         transition-all duration-300" 
                onClick={() => setLeadGateOpen(true)}
              >
                <span className="hidden xl:inline">Get Your Free Strategy Session</span>
                <span className="hidden lg:inline xl:hidden">Free Strategy Session</span>
                <span className="lg:hidden">Book Now</span>
              </MagneticButton>
            </div>

            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground relative z-[80]">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile menu backdrop */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-background/95 backdrop-blur-xl z-[60] md:hidden"
              />
            )}
          </AnimatePresence>

          {/* Mobile menu content */}
          <motion.div 
            initial={false} 
            animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
            className="md:hidden overflow-hidden fixed left-0 right-0 z-[70] bg-background/98 backdrop-blur-xl border-t border-glass-border shadow-2xl top-[72px]"
          >
            <div className="py-8 px-2 space-y-5">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="block text-foreground hover:text-primary hover:bg-primary/10 font-semibold text-lg px-4 py-3 rounded-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              {siteConfig.phoneNumber && (
                <div className="px-2">
                  <ClickToCall 
                    variant="outline"
                    trackingLocation="header_mobile"
                    className="w-full rounded-full"
                  />
                </div>
              )}
              <div className="px-2 pt-2">
                <Button 
                  className="w-full rounded-full bg-gradient-primary text-base font-semibold h-12" 
                  onClick={() => {
                    setLeadGateOpen(true);
                    setIsOpen(false);
                  }}
                >
                  Get Your Free Strategy Session
                </Button>
              </div>
            </div>
          </motion.div>
        </nav>
      </motion.header>
      
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
      <StrategySessionLeadGate open={leadGateOpen} onOpenChange={setLeadGateOpen} />
    </>
  );
};

export default Header;
