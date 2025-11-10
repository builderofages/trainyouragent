import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "bright-blue": {
          DEFAULT: "hsl(var(--bright-blue))",
          foreground: "hsl(var(--bright-blue-foreground))",
        },
        "deep-blue": {
          DEFAULT: "hsl(var(--deep-blue))",
          foreground: "hsl(var(--deep-blue-foreground))",
        },
        "ultra-blue": {
          DEFAULT: "hsl(var(--ultra-blue))",
          foreground: "hsl(var(--ultra-blue-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Industry-specific colors
        hvac: {
          primary: "hsl(var(--hvac-primary))",
          secondary: "hsl(var(--hvac-secondary))",
        },
        accounting: {
          primary: "hsl(var(--accounting-primary))",
          secondary: "hsl(var(--accounting-secondary))",
        },
        legal: {
          primary: "hsl(var(--legal-primary))",
          secondary: "hsl(var(--legal-secondary))",
        },
        healthcare: {
          primary: "hsl(var(--healthcare-primary))",
          secondary: "hsl(var(--healthcare-secondary))",
        },
        roofing: {
          primary: "hsl(var(--roofing-primary))",
          secondary: "hsl(var(--roofing-secondary))",
        },
        logistics: {
          primary: "hsl(var(--logistics-primary))",
          secondary: "hsl(var(--logistics-secondary))",
        },
        restaurants: {
          primary: "hsl(var(--restaurants-primary))",
          secondary: "hsl(var(--restaurants-secondary))",
        },
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-mesh': 'var(--gradient-mesh)',
        'gradient-premium': 'var(--gradient-premium)',
        'gradient-shimmer': 'var(--gradient-shimmer)',
        'gradient-hvac': 'linear-gradient(135deg, hsl(251, 91%, 71%) 0%, hsl(271, 91%, 65%) 100%)',
        'gradient-accounting': 'linear-gradient(135deg, hsl(142, 71%, 45%) 0%, hsl(45, 93%, 47%) 100%)',
        'gradient-legal': 'linear-gradient(135deg, hsl(271, 91%, 65%) 0%, hsl(45, 93%, 47%) 100%)',
        'gradient-healthcare': 'linear-gradient(135deg, hsl(188, 94%, 43%) 0%, hsl(326, 78%, 65%) 100%)',
        'gradient-roofing': 'linear-gradient(135deg, hsl(24, 95%, 53%) 0%, hsl(0, 72%, 51%) 100%)',
        'gradient-restaurants': 'linear-gradient(135deg, hsl(38, 92%, 50%) 0%, hsl(24, 95%, 53%) 100%)',
        'gradient-logistics': 'linear-gradient(135deg, hsl(217, 91%, 60%) 0%, hsl(220, 90%, 56%) 100%)',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        'blue': 'var(--shadow-blue)',
        'card': 'var(--shadow-card)',
        'dramatic': 'var(--shadow-dramatic)',
        'glow': 'var(--shadow-glow)',
        'glow-sm': '0 0 20px hsl(var(--primary) / 0.3)',
        'glow-intense': 'var(--shadow-glow-intense)',
        'premium': 'var(--shadow-premium)',
        'inner': 'var(--shadow-inner)',
      },
      backdropBlur: {
        'glass': '20px',
        'xl': '24px',
        '2xl': '32px',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "float-delayed": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-30px)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-left": {
          from: { opacity: "0", transform: "translateX(30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-right": {
          from: { opacity: "0", transform: "translateX(-30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(-5%)", animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)" },
          "50%": { transform: "translateY(0)", animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)" },
        },
        "tilt": {
          "0%, 50%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(0.5deg)" },
          "75%": { transform: "rotate(-0.5deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float-delayed 8s ease-in-out infinite",
        "slide-up": "slide-up 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-down": "slide-down 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-left": "slide-left 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-right": "slide-right 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-in": "scale-in 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "fade-in": "fade-in 0.6s ease-out",
        "shimmer": "shimmer 3s linear infinite",
        "pulse-slow": "pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "bounce-slow": "bounce-slow 3s infinite",
        "tilt": "tilt 10s infinite ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
