import "server-only";
import { BlogService } from "@/services/blog.service";

// Retained for dormant Studio actions. Git-backed public reads use the files
// included in each deployment, so they must not reuse the former Argos cache.
export const BLOG_CACHE_TAG = "blog-posts";

export const getPublishedPosts = BlogService.getPosts;
export const getPublishedPost = BlogService.getPostBySlug;
export const getRelatedPublishedPosts = BlogService.getRelatedPosts;
export const getPublishedCategories = BlogService.getCategories;
