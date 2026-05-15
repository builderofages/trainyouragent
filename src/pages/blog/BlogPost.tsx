// src/pages/blog/BlogPost.tsx
// /blog/:slug — single MDX post.

import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  getPostBySlug,
  getAdjacentPosts,
  formatDate,
  categorySlug,
} from "@/lib/blog";
import NewsletterCapture from "@/components/NewsletterCapture";
import NewsletterFloater from "@/components/NewsletterFloater";

const FONT = "'Inter Tight', system-ui, sans-serif";
const NAVY = "#042C53";
const BLUE = "#185FA5";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <Navigate to="/blog" replace />;

  const post = getPostBySlug(slug);
  if (!post) return <Navigate to="/blog" replace />;

  const { prev, next } = getAdjacentPosts(slug);
  const Body = post.Component;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: FONT }}>
      <Helmet>
        <title>{post.title} — Train Your Agent</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        {post.heroImage && <meta property="og:image" content={post.heroImage} />}
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        {(post.tags || []).map((t) => (
          <meta key={t} property="article:tag" content={t} />
        ))}
      </Helmet>

      {/* Hero */}
      <article className="max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-20">
        <Link
          to="/blog"
          className="text-[13px] text-slate-500 hover:text-slate-700"
        >
          ← Back to blog
        </Link>

        <div className="mt-8 mb-6">
          <Link
            to={`/blog/category/${categorySlug(post.category)}`}
            className="text-[12px] uppercase tracking-[0.18em] font-semibold"
            style={{ color: BLUE }}
          >
            {post.category}
          </Link>
        </div>
        <h1
          className="text-[36px] sm:text-[52px] font-semibold leading-[1.05] tracking-[-0.02em] mb-5"
          style={{ color: NAVY }}
        >
          {post.title}
        </h1>
        <div className="text-[14px] text-slate-500 mb-10">
          {post.author} · {formatDate(post.date)}
        </div>

        {post.heroImage && (
          <div className="rounded-2xl overflow-hidden bg-slate-100 mb-12 aspect-[2/1]">
            <img
              src={post.heroImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* MDX body */}
        <div className="prose prose-slate prose-lg max-w-none
                        prose-headings:font-semibold prose-headings:tracking-[-0.01em]
                        prose-h2:text-[28px] prose-h2:mt-12 prose-h2:mb-4
                        prose-h3:text-[20px] prose-h3:mt-8
                        prose-a:text-[#185FA5] prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-[#042C53]
                        prose-table:text-[14px]
                        prose-th:bg-slate-50 prose-th:text-left prose-th:px-3 prose-th:py-2
                        prose-td:px-3 prose-td:py-2 prose-td:border-t prose-td:border-slate-200">
          <Body />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="text-[12px] uppercase tracking-[0.18em] text-slate-500 mb-3">
              Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <Link
                  key={t}
                  to={`/blog/tag/${encodeURIComponent(t.toLowerCase())}`}
                  className="px-3 py-1 rounded-full bg-slate-100 text-[13px] text-slate-700 hover:bg-slate-200"
                >
                  #{t}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16">
          <NewsletterCapture
            variant="card"
            heading="Liked this? Get the next one in your inbox."
            sub="Once a week. Real builds, real numbers, the actual tools we used. No thought-leadership."
          />
        </div>

        {/* Prev / Next */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {next ? (
            <Link
              to={`/blog/${next.slug}`}
              className="block p-6 rounded-2xl border border-slate-200 hover:border-[#185FA5] transition-colors"
            >
              <div className="text-[12px] uppercase tracking-[0.18em] text-slate-500 mb-2">
                ← Older
              </div>
              <div className="font-semibold" style={{ color: NAVY }}>
                {next.title}
              </div>
            </Link>
          ) : (
            <div />
          )}
          {prev ? (
            <Link
              to={`/blog/${prev.slug}`}
              className="block p-6 rounded-2xl border border-slate-200 hover:border-[#185FA5] transition-colors text-right"
            >
              <div className="text-[12px] uppercase tracking-[0.18em] text-slate-500 mb-2">
                Newer →
              </div>
              <div className="font-semibold" style={{ color: NAVY }}>
                {prev.title}
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </article>

      {/* 30-second floater (one-time per session) */}
      <NewsletterFloater />
    </div>
  );
}
