// src/pages/blog/BlogIndex.tsx
// /blog — hero post + 2-col grid. Honors ?category= filter.

import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  getAllPosts,
  ALL_CATEGORIES,
  categorySlug,
  formatDate,
  type BlogPost,
} from "@/lib/blog";

const FONT = "'Inter Tight', system-ui, sans-serif";
const NAVY = "#042C53";
const BLUE = "#185FA5";

function PostCard({ post, large }: { post: BlogPost; large?: boolean }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`group block ${large ? "lg:col-span-2" : ""}`}
    >
      <div
        className={`overflow-hidden rounded-2xl bg-slate-100 mb-4 ${
          large ? "aspect-[2/1]" : "aspect-[3/2]"
        }`}
      >
        {post.heroImage ? (
          <img
            src={post.heroImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`,
            }}
          />
        )}
      </div>
      <div
        className="text-[11px] uppercase tracking-[0.18em] font-semibold mb-2"
        style={{ color: BLUE }}
      >
        {post.category}
      </div>
      <h3
        className={`font-semibold leading-tight mb-2 group-hover:text-[#185FA5] transition-colors ${
          large ? "text-[28px] sm:text-[36px]" : "text-[20px]"
        }`}
        style={{ color: NAVY }}
      >
        {post.title}
      </h3>
      <p
        className={`text-slate-600 leading-relaxed mb-3 ${
          large ? "text-[16px]" : "text-[14px]"
        }`}
      >
        {post.excerpt}
      </p>
      <div className="text-[12px] text-slate-500">
        {post.author} · {formatDate(post.date)}
      </div>
    </Link>
  );
}

export default function BlogIndex() {
  const [params] = useSearchParams();
  const filter = params.get("category");

  const all = getAllPosts();
  const filtered = filter
    ? all.filter((p) => categorySlug(p.category) === filter.toLowerCase())
    : all;

  const [hero, ...rest] = filtered;

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: FONT }}
    >
      <Helmet>
        <title>Blog — Train Your Agent</title>
        <meta
          name="description"
          content="Real builds, real numbers. AI voice, AI marketing, AI infrastructure for vertical SMB."
        />
        <link rel="alternate" type="application/rss+xml" title="Train Your Agent — Blog" href="/rss.xml" />
      </Helmet>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12 sm:py-20">
        <div className="mb-10">
          <div
            className="text-[12px] uppercase tracking-[0.18em] font-semibold mb-3"
            style={{ color: BLUE }}
          >
            Blog
          </div>
          <h1
            className="text-[32px] sm:text-[44px] md:text-[56px] font-semibold leading-[1.06] sm:leading-[1.05] tracking-[-0.02em] mb-4"
            style={{ color: NAVY }}
          >
            Real builds. Real numbers.
          </h1>
          <p className="text-[16px] sm:text-[18px] text-slate-600 max-w-2xl leading-relaxed">
            What we shipped this week, what it cost, what moved, what broke. No
            fluff, no thought-leadership. Just the work.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          <Link
            to="/blog"
            className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
              !filter
                ? "bg-[#042C53] text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All
          </Link>
          {ALL_CATEGORIES.map((c) => {
            const slug = categorySlug(c);
            const active = filter === slug;
            return (
              <Link
                key={c}
                to={`/blog?category=${slug}`}
                className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
                  active
                    ? "bg-[#042C53] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {c}
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-slate-500 italic">No posts in this category yet.</div>
        )}

        {hero && (
          <div className="mb-16">
            <PostCard post={hero} large />
          </div>
        )}

        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-14">
            {rest.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
