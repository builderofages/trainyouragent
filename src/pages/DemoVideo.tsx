import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Copy, Mail, Linkedin, Play, Clock, FileText, Calculator, TrendingUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { trackEvent } from "@/lib/tracking";
import { useSearchParams } from "react-router-dom";
import confetti from "canvas-confetti";

export default function DemoVideo() {
  const [searchParams] = useSearchParams();
  const [videoPlayed, setVideoPlayed] = useState(false);
  const confirmed = searchParams.get("confirmed") === "true";
  const industry = sessionStorage.getItem("booking_industry") || "your industry";

  useEffect(() => {
    // Track page view
    trackEvent("demo_video_page_viewed", {
      source: confirmed ? "booking_confirmation" : "direct",
      industry: industry,
    });

    // Celebration confetti for confirmed bookings
    if (confirmed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [confirmed, industry]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + "/demo-video");
    toast.success("Link copied to clipboard!");
    trackEvent("demo_video_shared", { method: "copy_link" });
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent("Check out this AI Agent Demo - TrainYourAgent");
    const body = encodeURIComponent(
      `I just booked a strategy session with TrainYourAgent to implement AI agents for our business.\n\nWatch this demo to see how it works:\n${window.location.origin}/demo-video\n\nThought you might find this interesting!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
    trackEvent("demo_video_shared", { method: "email" });
  };

  const handleLinkedInShare = () => {
    const url = encodeURIComponent(window.location.origin + "/demo-video");
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
    trackEvent("demo_video_shared", { method: "linkedin" });
  };

  const handleVideoPlay = () => {
    if (!videoPlayed) {
      setVideoPlayed(true);
      trackEvent("demo_video_played", { industry });
    }
  };

  const preparationChecklist = [
    "Gather your average monthly call volume data",
    "List current pain points with phone/lead handling",
    "Prepare questions about specific use cases for your business",
    "Have your CRM/calendar system details ready (if applicable)",
  ];

  const resources = [
    {
      icon: Calculator,
      title: "ROI Calculator",
      description: "Calculate potential savings for your business",
      link: "/demos#roi-calculator",
    },
    {
      icon: TrendingUp,
      title: "Case Studies",
      description: "See real results from businesses like yours",
      link: "/case-studies",
    },
    {
      icon: FileText,
      title: "Comparisons",
      description: "AI vs. Human Receptionist vs. Call Centers",
      link: "/comparisons",
    },
  ];

  const faqs = [
    {
      question: "What happens during the strategy session?",
      answer: "We'll analyze your current call handling, identify missed opportunities, discuss your specific needs, and show you exactly how AI can work for your business. No pressure, just insights.",
    },
    {
      question: "How long does implementation take?",
      answer: "Most implementations are completed in 3-7 days depending on the number of services, integrations needed, and your feedback speed. We'll confirm your specific timeline during the strategy session.",
    },
    {
      question: "Do I need any special equipment?",
      answer: "No special equipment needed. Our AI works with your existing phone system and integrates with your current CRM and calendar. We handle all the technical setup.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Confirmation */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Strategy Session is Confirmed! 🎉
            </h1>

            <p className="text-xl text-muted-foreground mb-6">
              Check your email for calendar invite and video call details.
            </p>

            <div className="bg-muted/50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">What Happens Next</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium">You'll receive a confirmation email</p>
                    <p className="text-sm text-muted-foreground">With video call link and meeting details</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium">We'll analyze your business needs</p>
                    <p className="text-sm text-muted-foreground">Custom demo tailored to {industry}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Get your implementation timeline</p>
                    <p className="text-sm text-muted-foreground">Clear roadmap to go live in 3-7 days</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Demo Video Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Watch: See Our AI in Action</h2>
              <p className="text-muted-foreground">
                90-second walkthrough of how AI agents handle real calls
              </p>
            </div>

            <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <div className="aspect-video bg-muted flex items-center justify-center">
                {/* Replace this with your actual video embed */}
                <div className="text-center p-8">
                  <Play className="w-16 h-16 mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground mb-4">
                    Video embed placeholder - Add your demo video URL
                  </p>
                  <Button onClick={handleVideoPlay} size="lg">
                    <Play className="w-4 h-4 mr-2" />
                    Play Demo Video
                  </Button>
                </div>
                
                {/* Example YouTube/Vimeo embed structure: */}
                {/* <iframe
                  src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                  title="AI Agent Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  onPlay={handleVideoPlay}
                /> */}
              </div>

              <div className="p-6">
                <p className="text-sm text-muted-foreground">
                  <strong>In this video:</strong> Watch how our AI agent handles an emergency HVAC call at 2 AM,
                  qualifies the lead, schedules the service, and captures payment details—all without human
                  intervention. See the exact dashboard view your team will use.
                </p>
              </div>
            </Card>
          </motion.div>
        </section>

        {/* Preparation Checklist */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6">How to Prepare for Your Call</h2>
            <Card className="p-6">
              <ul className="space-y-4">
                {preparationChecklist.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </section>

        {/* Share Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-8 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Share This With Your Team</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Forward this page to stakeholders or partners who should know about the implementation.
                It helps everyone come prepared to the strategy session.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button onClick={handleCopyLink} variant="outline">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>

                <Button onClick={handleEmailShare} variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Share via Email
                </Button>

                <Button onClick={handleLinkedInShare} variant="outline">
                  <Linkedin className="w-4 h-4 mr-2" />
                  Share on LinkedIn
                </Button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Additional Resources */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Explore More Before Your Call</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    window.location.href = resource.link;
                    trackEvent("demo_video_resource_clicked", { resource: resource.title });
                  }}
                >
                  <resource.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                </Card>
              ))}
            </div>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Quick FAQs</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="p-6">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Footer CTA */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <Clock className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Questions Before Your Call?</h2>
              <p className="text-muted-foreground mb-6">
                Our team is here to help. Reach out anytime.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "mailto:support@trainyouragent.com")}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  support@trainyouragent.com
                </Button>
              </div>
            </Card>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
