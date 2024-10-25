import Link from "next/link";
import BlurImage from "./blur-image";
import { timeAgo } from "@/lib/utils";

interface Author {
  name: string;
  image: string;
}

interface Authors {
  [key: string]: Author;
}

const authors: Authors = {
  codehagen: {
    name: "Christer Hagen",
    image:
      "https://imagedelivery.net/r-6-yk-gGPtjfbIST9-8uA/addc4b60-4c8f-47d7-10ab-6f9048432500/public",
  },
  fmerian: {
    name: "Flo Merian",
    image: "https://d2vwwcvoksz7ty.cloudfront.net/author/fmerian.jpg",
  },
};

export default async function Author({
  username,
  updatedAt,
  imageOnly,
}: {
  username: string;
  updatedAt?: string;
  imageOnly?: boolean;
}) {
  const author = authors[username as keyof typeof authors];

  return imageOnly ? (
    <BlurImage
      src={author.image}
      alt={author.name}
      width={36}
      height={36}
      className="rounded-full transition-all group-hover:brightness-90"
    />
  ) : updatedAt ? (
    <div className="flex items-center space-x-3">
      <BlurImage
        src={author.image}
        alt={author.name}
        width={36}
        height={36}
        className="rounded-full"
      />
      <div className="flex flex-col">
        <p className="text-sm text-gray-500">Skrevet av {author.name}</p>
        <time dateTime={updatedAt} className="text-sm font-light text-gray-400">
          Sist oppdatert {timeAgo(new Date(updatedAt))}
        </time>
      </div>
    </div>
  ) : (
    <Link
      href={`https://twitter.com/${username}`}
      className="group flex items-center space-x-3"
      target="_blank"
      rel="noopener noreferrer"
    >
      <BlurImage
        src={author.image}
        alt={author.name}
        width={40}
        height={40}
        className="rounded-full transition-all group-hover:brightness-90"
      />
      <div className="flex flex-col">
        <p className="font-semibold text-gray-700">{author.name}</p>
        <p className="text-sm text-gray-500">@{username}</p>
      </div>
    </Link>
  );
}
