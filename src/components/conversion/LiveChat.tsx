import { useEffect } from "react";

export const LiveChat = () => {
  useEffect(() => {
  // Get your FREE Tawk.to IDs at https://www.tawk.to/
  // 1. Sign up (free) → 2. Create property → 3. Get Property ID & Widget ID from dashboard
  // 4. Replace below with your real IDs (format: "67abc123def456" and "1hijk789lmn012")
  // 5. Customize in Tawk.to dashboard: Appearance → Set widget color to #3B82F6 (primary blue)
  const propertyId = "YOUR_TAWK_PROPERTY_ID"; // Replace with your real ID
  const widgetId = "YOUR_TAWK_WIDGET_ID"; // Replace with your real ID

    if (!propertyId || propertyId === "YOUR_TAWK_PROPERTY_ID") {
      console.log("Tawk.to not configured. Add your property ID to enable live chat.");
      return;
    }

    // Create script element
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    // Append to document
    document.body.appendChild(script);

    // Cleanup
    return () => {
      // Remove script when component unmounts
      const existingScript = document.querySelector(`script[src*="tawk.to"]`);
      if (existingScript) {
        existingScript.remove();
      }
      
      // Remove Tawk widget
      const tawkWidget = document.getElementById("tawkId");
      if (tawkWidget) {
        tawkWidget.remove();
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
};
