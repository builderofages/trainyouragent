import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MultiStepForm } from "@/components/conversion/MultiStepForm";
import { TrustBadges } from "@/components/conversion/TrustBadges";
import { CheckCircle } from "lucide-react";

const DemoRequest = () => {
  const benefits = [
    "See how AI agents work in your industry",
    "Get a custom ROI calculation",
    "Learn automation strategies",
    "No commitment required",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-secondary/30 to-white">
      <Header />
      
      <div className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
              Request a Demo
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              See how AI agents can transform your business operations
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 text-left"
                >
                  <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-blue">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-muted-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="mb-12">
              <TrustBadges variant="compact" />
            </div>
          </div>

          {/* Multi-Step Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MultiStepForm />
          </motion.div>

          {/* Additional Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-muted-foreground">
              🔒 Your information is secure and will never be shared
            </p>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default DemoRequest;
