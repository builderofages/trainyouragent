import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Dumbbell, Wrench, Stethoscope, Scale, Home, Sparkles } from "lucide-react";

const industries = [
  {
    id: "gym",
    title: "Gym & Fitness",
    tagline: "Memberships. Classes. Tours.",
    description: "Handles membership inquiries, class schedules, tour bookings, and follow-ups",
    image: "/images/industries/gym.jpg",
    icon: Dumbbell,
    link: "/gym",
  },
  {
    id: "hvac",
    title: "HVAC & Home Services",
    tagline: "Emergency. Scheduling. Quotes.",
    description: "24/7 emergency dispatch, service scheduling, quote requests, and follow-ups",
    image: "/images/industries/hvac.jpg",
    icon: Wrench,
    link: "/hvac",
  },
  {
    id: "healthcare",
    title: "Healthcare & Dental",
    tagline: "Intake. Scheduling. Compliance.",
    description: "Patient intake, appointment scheduling, insurance verification, reminders",
    image: "/images/industries/healthcare.jpg",
    icon: Stethoscope,
    badge: "HIPAA COMPLIANT",
    link: "/healthcare",
  },
  {
    id: "legal",
    title: "Legal",
    tagline: "Intake. Consultation. Qualification.",
    description: "Client intake, consultation booking, case qualification, conflict checking",
    image: "/images/industries/legal.jpg",
    icon: Scale,
    link: "/legal",
  },
  {
    id: "real-estate",
    title: "Real Estate",
    tagline: "Inquiries. Showings. Qualification.",
    description: "Property inquiries, showing schedules, buyer/seller qualification",
    image: "/images/industries/real-estate.jpg",
    icon: Home,
    link: "/real-estate",
  },
  {
    id: "custom",
    title: "Custom",
    tagline: "Your Industry. Your Way.",
    description: "Don't see your industry? We build custom solutions for any business",
    image: null,
    icon: Sparkles,
    link: "/contact",
  },
];

export const IndustriesGrid = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Tag */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-trust-blue text-sm font-semibold tracking-widest uppercase">
            Built For Your Business
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="text-4xl md:text-5xl font-black text-text-primary text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          AI That Actually Understands Your Industry
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          className="text-lg text-text-secondary text-center mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          We don't do generic. Your AI is trained specifically for how YOUR customers talk.
        </motion.p>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.id}
              className="group relative h-[280px] rounded-2xl overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => navigate(industry.link)}
            >
              {/* Background */}
              {industry.image ? (
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${industry.image})` }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-trust-blue to-tech-cyan" />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-deep-space via-deep-space/60 to-transparent 
                            group-hover:from-deep-space/90 group-hover:via-deep-space/50 transition-all duration-300" />

              {/* Badge */}
              {industry.badge && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-success-green text-white text-xs font-bold rounded-full">
                  {industry.badge}
                </div>
              )}

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="mb-2">
                  <industry.icon className="w-8 h-8 text-white opacity-80" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{industry.title}</h3>
                <p className="text-slate-700 text-sm mb-2">{industry.tagline}</p>
                
                {/* Hidden description revealed on hover */}
                <motion.p
                  className="text-slate-700 text-sm overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  whileHover={{ height: "auto", opacity: 1 }}
                >
                  {industry.description}
                </motion.p>

                <span className="text-tech-cyan text-sm font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Explore →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
