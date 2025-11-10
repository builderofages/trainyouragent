import { useEffect } from "react";

export const LiveChat = () => {
  useEffect(() => {
    // Tawk.to Live Chat Integration
    // Add your Tawk.to property ID here
    const propertyId = "YOUR_TAWK_PROPERTY_ID";
    const widgetId = "YOUR_TAWK_WIDGET_ID";

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
