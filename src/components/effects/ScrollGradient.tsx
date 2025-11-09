import { motion, useScroll, useTransform } from "framer-motion";

export const ScrollGradient = () => {
  const { scrollYProgress } = useScroll();
  
  const color1 = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 1],
    [
      "hsla(211, 100%, 66%, 0.1)",
      "hsla(217, 91%, 60%, 0.08)",
      "hsla(220, 13%, 69%, 0.06)",
      "hsla(211, 100%, 66%, 0.1)"
    ]
  );

  const color2 = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 1],
    [
      "hsla(217, 91%, 60%, 0.08)",
      "hsla(220, 13%, 69%, 0.06)",
      "hsla(211, 100%, 66%, 0.1)",
      "hsla(217, 91%, 60%, 0.08)"
    ]
  );

  return (
    <>
      <motion.div
        className="fixed top-20 right-10 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: color1 }}
      />
      <motion.div
        className="fixed bottom-20 left-10 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: color2 }}
      />
    </>
  );
};
