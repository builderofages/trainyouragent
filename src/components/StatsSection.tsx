import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TrendingUp, Users, Zap, Target } from "lucide-react";

const stats = [
  {
    icon: TrendingUp,
    value: 80,
    suffix: "%",
    label: "Operations Automated",
    description: "Free your team from repetitive tasks",
  },
  {
    icon: Users,
    value: 500,
    suffix: "+",
    label: "Businesses Transformed",
    description: "Across multiple industries",
  },
  {
    icon: Zap,
    value: 10,
    suffix: "X",
    label: "Faster Lead Processing",
    description: "Never miss an opportunity",
  },
  {
    icon: Target,
    value: 95,
    suffix: "%",
    label: "Client Satisfaction",
    description: "Proven results, happy clients",
  },
];

const CountUp = ({ end, suffix, duration = 2 }: { end: number; suffix: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-neon">
      {count}{suffix}
    </span>
  );
};

const StatsSection = () => {
  return (
    <section className="py-24 px-4 bg-void relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--neon-growth)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--neon-growth)) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-4 text-white">
            The Power of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-neon">
              AI Automation
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Real numbers from real businesses that chose to evolve
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="group"
            >
              <div className="relative bg-card/10 backdrop-blur-md border border-neon/20 rounded-3xl p-8 hover:border-neon/50 transition-all hover:shadow-glow">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="mb-6"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-neon flex items-center justify-center shadow-glow">
                    <stat.icon className="w-7 h-7 text-void" />
                  </div>
                </motion.div>

                {/* Value */}
                <div className="mb-3">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm">
                  {stat.description}
                </p>

                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl bg-gradient-neon opacity-0 group-hover:opacity-5 transition-opacity"
                  whileHover={{ scale: 1.02 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
