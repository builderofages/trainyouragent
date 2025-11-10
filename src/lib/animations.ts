// Reusable animation variants for Framer Motion

export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  }
};

export const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.3, ease: "easeInOut" }
};

export const hoverLift = {
  y: -8,
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
};

export const pulseGlow = {
  boxShadow: [
    "0 0 0 0 hsl(var(--primary) / 0)",
    "0 0 20px 5px hsl(var(--primary) / 0.3)",
    "0 0 0 0 hsl(var(--primary) / 0)"
  ],
  transition: { duration: 2, repeat: Infinity }
};
