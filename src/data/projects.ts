interface Project {
  slug: string;
  image: string;
  tags: string[];
  href: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: "proyecto-saas",
    image: "/images/projects/project-01.jpg",
    tags: ["Next.js", "TypeScript", "AWS", "PostgreSQL"],
    href: "#",
    featured: true,
  },
  {
    slug: "app-mobile",
    image: "/images/projects/project-02.jpg",
    tags: ["React Native", "Firebase", "Node.js"],
    href: "#",
  },
  {
    slug: "ecommerce",
    image: "/images/projects/project-03.jpg",
    tags: ["Next.js", "Shopify", "Tailwind"],
    href: "#",
  },
];
