import { motion, useScroll, useTransform } from "framer-motion";

export const ScrollGradient = () => {
  const { scrollYProgress } = useScroll();

  // Transform scroll progress to color stops
  const colorStop1 = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [
      "hsl(211, 100%, 66%)",
      "hsl(280, 100%, 70%)",
      "hsl(340, 100%, 65%)",
      "hsl(30, 100%, 60%)",
      "hsl(160, 100%, 50%)",
    ]
  );

  const colorStop2 = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [
      "hsl(217, 91%, 60%)",
      "hsl(260, 91%, 65%)",
      "hsl(320, 91%, 60%)",
      "hsl(50, 91%, 55%)",
      "hsl(180, 91%, 45%)",
    ]
  );

  const colorStop3 = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [
      "hsl(240, 100%, 70%)",
      "hsl(300, 100%, 75%)",
      "hsl(10, 100%, 60%)",
      "hsl(80, 100%, 50%)",
      "hsl(200, 100%, 55%)",
    ]
  );

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <>
      {/* Dynamic gradient orb 1 */}
      <motion.div
        className="fixed top-0 right-0 w-[800px] h-[800px] rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${colorStop1} 0%, transparent 70%)`,
          scale,
        }}
      />

      {/* Dynamic gradient orb 2 */}
      <motion.div
        className="fixed bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-40 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${colorStop2} 0%, transparent 70%)`,
          scale,
          rotate,
        }}
      />

      {/* Dynamic gradient orb 3 */}
      <motion.div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-2xl opacity-25 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${colorStop3} 0%, transparent 70%)`,
          scale: useTransform(scrollYProgress, [0, 1], [1, 2]),
        }}
      />
    </>
  );
};
