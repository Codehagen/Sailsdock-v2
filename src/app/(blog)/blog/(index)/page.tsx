import BlogCard from "@/components/blog/blog-card";
import { getBlurDataURL } from "@/lib/hooks/images";
import { constructMetadata } from "@/lib/utils";
import { allBlogPosts } from "content-collections";
import { siteConfig } from "@/lib/config";

export const metadata = constructMetadata({
  title: "Blog – Propdock",
  description: `Latest news and updates from ${siteConfig.name}.`,
});

export default async function Blog() {
  const articles = await Promise.all(
    // order by publishedAt (desc)
    allBlogPosts
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      .map(async (post) => ({
        ...post,
        blurDataURL: await getBlurDataURL(post.image),
      }))
  );

  return articles.map((article, idx) => (
    <BlogCard key={article.slug} data={article} priority={idx <= 1} />
  ));
}
