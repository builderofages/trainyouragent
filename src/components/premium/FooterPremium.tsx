import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Linkedin, Twitter, Instagram } from "lucide-react";
import { siteConfig } from "@/config/site";

const solutions = [
  { name: "AI Voice Agents", href: "/solutions" },
  { name: "AI Chatbots", href: "/solutions" },
  { name: "Workflow Automation", href: "/solutions" },
  { name: "AI Consulting", href: "/contact" },
];

const industries = [
  { name: "Gyms & Fitness", href: "/gym" },
  { name: "Home Services", href: "/hvac" },
  { name: "Healthcare", href: "/healthcare" },
  { name: "Legal", href: "/legal" },
  { name: "Real Estate", href: "/real-estate" },
  { name: "Custom Solutions", href: "/contact" },
];

const company = [
  { name: "About Us", href: "/about" },
  { name: "Pricing", href: "/pricing" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "Contact", href: "/contact" },
];

export const FooterPremium = () => {
  return (
    <footer className="bg-[#050a10] py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-white">{siteConfig.companyName}</span>
            </Link>
            <p className="text-slate-700 text-sm mb-6 leading-relaxed">
              AI that answers. AI that closes.
              <br />
              AI that never sleeps.
            </p>
            
            {/* Social icons */}
            <div className="flex gap-4">
              <a
                href={siteConfig.socialMedia.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center 
                         hover:bg-white/10 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-slate-700" />
              </a>
              <a
                href={siteConfig.socialMedia.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center 
                         hover:bg-white/10 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-slate-700" />
              </a>
              <a
                href={siteConfig.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center 
                         hover:bg-white/10 transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-slate-700" />
              </a>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-white font-semibold mb-4">Solutions</h4>
            <ul className="space-y-3">
              {solutions.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-slate-700 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h4 className="text-white font-semibold mb-4">Industries</h4>
            <ul className="space-y-3">
              {industries.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-slate-700 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-slate-700 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#042C53]/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-700 text-sm">
            © {new Date().getFullYear()} {siteConfig.companyName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-slate-700 hover:text-slate-700 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-slate-700 hover:text-slate-700 text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
