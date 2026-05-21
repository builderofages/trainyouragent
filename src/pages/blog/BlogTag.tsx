// src/pages/blog/BlogTag.tsx
// /blog/tag/:tag

import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import { getPostsByTag, formatDate } from "@/lib/blog";

const FONT = "'Inter Tight', system-ui, sans-serif";
const NAVY = "#042C53";
const BLUE = "#185FA5";

export default function BlogTag() {
  const { tag } = useParams<{ tag: string }>();
  if (!tag) return <Navigate to="/blog" replace />;

  const decoded = decodeURIComponent(tag);
  const posts = getPostsByTag(decoded);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: FONT }}>
      <Helmet>
        <title>#{decoded} — Train Your Agent Blog</title>
        <meta
          name="description"
          content={`All posts tagged #${decoded} on Train Your Agent.`}
        />
      </Helmet>

      <SiteNav active="resources" />

      <div className="max-w-4xl mx-auto px-6 sm:px-8 pt-28 sm:pt-32 pb-12 sm:pb-20">
        <Link to="/blog" className="text-[13px] text-slate-500 hover:text-slate-700">
          ← All posts
        </Link>
        <div
          className="text-[12px] uppercase tracking-[0.18em] font-semibold mt-8 mb-3"
          style={{ color: BLUE }}
        >
          Tag
        </div>
        <h1
          className="text-[40px] sm:text-[56px] font-semibold leading-[1.05] tracking-[-0.02em] mb-12"
          style={{ color: NAVY }}
        >
          #{decoded}
        </h1>

        {posts.length === 0 && (
          <div className="text-slate-500 italic">No posts with this tag yet.</div>
        )}

        <div className="space-y-8">
          {posts.map((p) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              className="block group border-b border-slate-200 pb-8"
            >
              <div className="text-[12px] text-slate-500 mb-1">
                {p.category} · {formatDate(p.date)}
              </div>
              <h2
                className="text-[22px] font-semibold leading-tight group-hover:text-[#185FA5]"
                style={{ color: NAVY }}
              >
                {p.title}
              </h2>
              <p className="text-[14px] text-slate-600 mt-2 leading-relaxed">
                {p.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <FooterV44 />
    </div>
  );
}
