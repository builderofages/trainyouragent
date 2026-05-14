import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Niche slugs map to vertical paths — old /niche/X URLs forward to canonical vertical.
const MAP: Record<string, string> = {
  healthcare: "/healthcare", legal: "/legal", "real-estate": "/real-estate", hvac: "/hvac",
  roofing: "/roofing", solar: "/solar", accounting: "/accounting", automotive: "/automotive",
  spas: "/spas", hotels: "/hotels", "bars-nightclubs": "/bars-nightclubs", logistics: "/logistics",
  gym: "/gym", fitness: "/gym",
};

const NicheLanding = () => {
  const { nicheId = "" } = useParams<{ nicheId: string }>();
  const nav = useNavigate();
  useEffect(() => {
    const target = MAP[nicheId.toLowerCase()] || "/solutions";
    nav(target, { replace: true });
  }, [nicheId, nav]);
  return null;
};

export default NicheLanding;
