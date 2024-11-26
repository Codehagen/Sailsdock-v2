import { getBlogPosts } from "@/lib/blog";
import { MetadataRoute } from "next";
import { headers } from "next/headers";
import { allHelpPosts } from "content-collections";
import { HELP_CATEGORIES } from "@/lib/blog/content";

type HelpCategorySlug = (typeof HELP_CATEGORIES)[number]["slug"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPosts = await getBlogPosts();
  const headersList = await headers();
  let domain = headersList.get("host") as string;
  let protocol = "https";
  const baseUrl = `${protocol}://${domain}`;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    // Blog posts
    ...allPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(),
    })),
    // Help articles
    ...allHelpPosts.map((post) => ({
      url: `${baseUrl}/help/article/${post.slug}`,
      lastModified: new Date(post.updatedAt),
    })),
    // Help categories
    ...allHelpPosts
      .map((post) => post.categories?.[0])
      .filter(
        (category): category is HelpCategorySlug =>
          !!category && HELP_CATEGORIES.some((c) => c.slug === category)
      )
      .filter((category, index, self) => self.indexOf(category) === index)
      .map((category) => ({
        url: `${baseUrl}/help/category/${category}`,
        lastModified: new Date(),
      })),
  ];
}
