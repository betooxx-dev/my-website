interface BlogPost {
  slug: string;
  date: string;
  image?: string;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "arquitectura-frontend-2026",
    date: "2026-02-15",
    image: "/images/blog/post-01.jpg",
    featured: true,
  },
  {
    slug: "typescript-avanzado",
    date: "2026-01-28",
  },
  {
    slug: "productividad-developer",
    date: "2026-01-10",
  },
];
