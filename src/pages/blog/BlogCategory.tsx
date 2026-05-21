// src/pages/blog/BlogCategory.tsx
// /blog/category/:category

import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import {
  getPostsByCategory,
  slugToCategory,
  formatDate,
  ALL_CATEGORIES,
  categorySlug,
} from "@/lib/blog";

const FONT = "'Inter Tight', system-ui, sans-serif";
const NAVY = "#042C53";
const BLUE = "#185FA5";

export default function BlogCategory() {
  const { category } = useParams<{ category: string }>();
  if (!category) return <Navigate to="/blog" replace />;

  const display = slugToCategory(category);
  const matched = ALL_CATEGORIES.find(
    (c) => c.toLowerCase() === display.toLowerCase()
  );
  if (!matched) return <Navigate to="/blog" replace />;

  const posts = getPostsByCategory(matched);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: FONT }}>
      <Helmet>
        <title>{matched} — Train Your Agent Blog</title>
        <meta
          name="description"
          content={`All posts in ${matched}. Real builds, real numbers from Train Your Agent.`}
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
          Category
        </div>
        <h1
          className="text-[40px] sm:text-[56px] font-semibold leading-[1.05] tracking-[-0.02em] mb-12"
          style={{ color: NAVY }}
        >
          {matched}
        </h1>

        {posts.length === 0 && (
          <div className="text-slate-500 italic">No posts yet in this category.</div>
        )}

        <div className="space-y-10">
          {posts.map((p) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              className="block group border-b border-slate-200 pb-10"
            >
              <div className="text-[12px] text-slate-500 mb-2">
                {formatDate(p.date)}
              </div>
              <h2
                className="text-[24px] sm:text-[28px] font-semibold leading-tight mb-2 group-hover:text-[#185FA5]"
                style={{ color: NAVY }}
              >
                {p.title}
              </h2>
              <p className="text-[15px] text-slate-600 leading-relaxed">
                {p.excerpt}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap gap-2">
          <span className="text-[13px] text-slate-500 self-center mr-2">
            Other categories:
          </span>
          {ALL_CATEGORIES.filter((c) => c !== matched).map((c) => (
            <Link
              key={c}
              to={`/blog/category/${categorySlug(c)}`}
              className="px-3 py-1 rounded-full bg-slate-100 text-[13px] text-slate-700 hover:bg-slate-200"
            >
              {c}
            </Link>
          ))}
        </div>
      </div>

      <FooterV44 />
    </div>
  );
}
