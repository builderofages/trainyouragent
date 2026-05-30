// src/lib/blog.ts
// Loads MDX blog posts at build time using Vite's import.meta.glob.
// Each .mdx file in src/content/blog/ exports its frontmatter and a default
// React component (the rendered MDX body).

import type { ComponentType } from "react";

export type BlogCategory =
  | "AI Voice"
  | "AI Marketing"
  | "AI Infrastructure"
  | "AI Strategy"
  | "Vertical Playbooks"
  | "Founder Notes";

export type BlogFrontmatter = {
  title: string;
  slug: string;
  date: string;            // ISO YYYY-MM-DD
  author: string;
  excerpt: string;
  category: BlogCategory;
  heroImage?: string;
  tags?: string[];
};

export type BlogPost = BlogFrontmatter & {
  Component: ComponentType;
};

// Vite glob: eager so we have synchronous access on first render.
// `@mdx-js/rollup` exposes `frontmatter` as a named export when used with
// `remark-frontmatter` + `remark-mdx-frontmatter`.
type MDXModule = {
  default: ComponentType;
  frontmatter: BlogFrontmatter;
};

const modules = import.meta.glob<MDXModule>("../content/blog/*.mdx", {
  eager: true,
});

const allPosts: BlogPost[] = Object.values(modules)
  .map((m) => ({ ...m.frontmatter, Component: m.default }))
  .filter((p) => !!p.slug && !!p.title)
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getAllPosts(): BlogPost[] {
  return allPosts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  const c = category.toLowerCase();
  return allPosts.filter((p) => p.category.toLowerCase() === c);
}

export function getPostsByTag(tag: string): BlogPost[] {
  const t = tag.toLowerCase();
  return allPosts.filter((p) => (p.tags || []).some((x) => x.toLowerCase() === t));
}

export function getAdjacentPosts(slug: string): { prev?: BlogPost; next?: BlogPost } {
  const i = allPosts.findIndex((p) => p.slug === slug);
  if (i === -1) return {};
  // Posts are sorted newest-first. "Next" = older, "Prev" = newer.
  return {
    prev: i > 0 ? allPosts[i - 1] : undefined,
    next: i < allPosts.length - 1 ? allPosts[i + 1] : undefined,
  };
}

export const ALL_CATEGORIES: BlogCategory[] = [
  "AI Voice",
  "AI Marketing",
  "AI Infrastructure",
  "AI Strategy",
  "Vertical Playbooks",
  "Founder Notes",
];

export function categorySlug(c: string): string {
  return c.toLowerCase().replace(/\s+/g, "-");
}

export function slugToCategory(s: string): string {
  return s.replace(/-/g, " ");
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
