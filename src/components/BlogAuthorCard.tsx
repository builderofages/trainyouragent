// src/components/BlogAuthorCard.tsx
// v41: author card at the bottom of every blog post.

import { Link } from "react-router-dom";

const NAVY = "#042C53";
const BLUE = "#185FA5";

export default function BlogAuthorCard() {
  return (
    <aside
      className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center"
      aria-label="About the author"
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: NAVY }}
        aria-hidden="true"
      >
        {/* simple PrismNode-style mark — three diamonds */}
        <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
          <rect x="6"  y="14" width="10" height="10" transform="rotate(45 11 19)" fill="#9BC3E8" />
          <rect x="15" y="6"  width="10" height="10" transform="rotate(45 20 11)" fill="white" />
          <rect x="24" y="14" width="10" height="10" transform="rotate(45 29 19)" fill="#185FA5" />
        </svg>
      </div>
      <div className="flex-1">
        <div className="text-[14px] font-semibold" style={{ color: NAVY }}>
          Alexander Mills, Founder of TrainYourAgent
        </div>
        <div className="text-[13px] text-slate-600 leading-snug mt-1">
          Four years deep in production AI. Builds voice + chat agents for SMBs.
          Writes the build logs nobody else publishes.
        </div>
        <Link to="/about" className="inline-block mt-2 text-[12px] font-medium" style={{ color: BLUE }}>
          More about Alexander →
        </Link>
      </div>
    </aside>
  );
}
