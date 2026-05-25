import { motion } from "framer-motion";
import { MessageSquare, Workflow, TrendingUp, Lightbulb, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    icon: MessageSquare,
    title: "AI Chatbots",
    description: "Website and SMS chat that qualifies leads and books appointments 24/7.",
    link: "/solutions",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "Eliminate repetitive tasks. Let AI handle follow-ups, reminders, admin.",
    link: "/solutions",
  },
  {
    icon: TrendingUp,
    title: "AI Sales Systems",
    description: "Turn your team into closers with AI-powered lead scoring and follow-up.",
    link: "/solutions",
  },
  {
    icon: Lightbulb,
    title: "AI Consulting",
    description: "Transform your entire operation. We train your staff to work 10x faster.",
    link: "/contact",
  },
];

export const BeyondVoice = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-deep-space to-surface overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Tag */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-tech-cyan text-sm font-semibold tracking-widest uppercase">
            More Than Voice
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="text-4xl md:text-5xl font-black text-white text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Voice Agents Are Just The Beginning
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          className="text-lg text-slate-700 text-center mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          We don't just answer phones. We transform how businesses operate.
        </motion.p>

        {/* Service cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="group relative bg-white/5 border border-[#042C53]/10 rounded-2xl p-6 
                       hover:bg-white/10 hover:border-[#042C53]/20 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + index * 0.1 }}
              onClick={() => navigate(service.link)}
              whileHover={{ y: -4 }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-trust-blue to-tech-cyan 
                            flex items-center justify-center mb-4">
                <service.icon className="w-6 h-6 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>

              {/* Description */}
              <p className="text-slate-700 text-sm leading-relaxed mb-4">
                {service.description}
              </p>

              {/* Link */}
              <span className="inline-flex items-center text-tech-cyan text-sm font-semibold 
                             opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                See how it ships <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-slate-700 mb-4">
            Want to see how AI can transform your entire business?
          </p>
          <button
            onClick={() => window.open("https://cal.com/trainyouragent", "_blank")}
            className="inline-flex items-center px-6 py-3 bg-white text-deep-space font-semibold 
                     rounded-full hover:bg-white/90 transition-all duration-300"
          >
            Book a Strategy Call <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
