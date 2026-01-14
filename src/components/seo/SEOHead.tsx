import { Helmet } from "react-helmet";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  industry?: string;
  noindex?: boolean;
  structuredData?: object;
}

// AEO-optimized FAQ schema generator
const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

// Industry-specific How-To schema
const generateHowToSchema = (title: string, steps: string[]) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: title,
  step: steps.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    text: step,
  })),
});

// Service schema for AEO
const generateServiceSchema = (
  name: string,
  description: string,
  provider: string,
  areaServed: string = "United States"
) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name,
  description,
  provider: {
    "@type": "Organization",
    name: provider,
  },
  areaServed: {
    "@type": "Country",
    name: areaServed,
  },
});

export const SEOHead = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = "/og-image.jpg",
  ogType = "website",
  industry,
  noindex = false,
  structuredData,
}: SEOHeadProps) => {
  const fullTitle = `${title} | TrainYourAgent`;
  const baseUrl = "https://trainyouragent.com";
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : baseUrl;
  const fullOgImage = ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`;

  // Industry-specific schema
  const industrySchema = industry
    ? generateServiceSchema(
        `${industry} AI Voice Agent`,
        `24/7 AI voice agent solution for ${industry.toLowerCase()} businesses. Handles calls, books appointments, and captures leads automatically.`,
        "TrainYourAgent"
      )
    : null;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="TrainYourAgent" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:site" content="@trainyouragent" />
      <meta name="twitter:creator" content="@trainyouragent" />

      {/* Additional SEO */}
      <meta name="author" content="TrainYourAgent" />
      <meta name="publisher" content="TrainYourAgent" />
      <meta name="format-detection" content="telephone=no" />

      {/* Structured Data */}
      {industrySchema && (
        <script type="application/ld+json">
          {JSON.stringify(industrySchema)}
        </script>
      )}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

// Pre-built AEO FAQ schemas for common questions
export const commonFAQs = {
  general: [
    {
      question: "How fast can TrainYourAgent be deployed?",
      answer: "Most businesses are live within 5 business days. Simple setups can be completed in 3 days, while enterprise customizations typically take 1-2 weeks.",
    },
    {
      question: "What happens if the AI can't handle a call?",
      answer: "The AI gathers caller information and notifies you instantly via text and email. For urgent situations, it can transfer to a live number. You never lose the lead.",
    },
    {
      question: "Does TrainYourAgent work with my existing phone number?",
      answer: "Yes. We port your number or set up forwarding. Your customers won't notice anything changed - except someone always answers now.",
    },
    {
      question: "What is the cost of AI voice agents?",
      answer: "Plans start at $497/month for 200 calls, with Growth plans at $997/month for 500 calls. Enterprise unlimited plans are $1,497/month. All plans include setup fees.",
    },
    {
      question: "Is there a guarantee?",
      answer: "Yes, we offer a 30-day guarantee. If you're not seeing ROI in month one, we work with you to fix it or refund your setup fee. No questions asked.",
    },
  ],
  gym: [
    {
      question: "How can AI help my gym capture more members?",
      answer: "AI voice agents answer every call 24/7, schedule tours, follow up with trial pass leads, and book personal training sessions - even during peak hours when staff is busy with members on the floor.",
    },
    {
      question: "Can AI reduce gym member churn?",
      answer: "Yes. AI proactively contacts at-risk members, handles cancellation save attempts, and re-engages lapsed members with personalized win-back campaigns, reducing the 31% average annual churn rate.",
    },
    {
      question: "Does the AI integrate with gym management software?",
      answer: "Yes, we integrate with major gym software including Mindbody, Glofox, Zen Planner, and ClubReady for seamless member management and booking.",
    },
  ],
};

export { generateFAQSchema, generateHowToSchema, generateServiceSchema };
