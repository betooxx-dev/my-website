import axios from "axios";
import { z } from "zod";
import { blogPostSchema } from "@/contracts";
import type { Locale } from "@/i18n/routing";
import api from "./api";

export type { BlogPost } from "@/contracts";

export class BlogService {
  static async getPosts(locale: Locale) {
    const { data } = await api.get(`/blog/posts?locale=${locale}`);
    return blogPostSchema.array().parse(data.data);
  }

  static async getPostBySlug(locale: Locale, slug: string) {
    try {
      const { data } = await api.get(
        `/blog/posts/${locale}/${encodeURIComponent(slug)}`,
      );
      return blogPostSchema.parse(data.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return undefined;
      }
      throw error;
    }
  }

  static async getRelatedPosts(locale: Locale, slug: string) {
    const { data } = await api.get(
      `/blog/posts/${locale}/${encodeURIComponent(slug)}/related`,
    );
    return blogPostSchema.array().parse(data.data);
  }

  static async getAllTags(locale: Locale) {
    const { data } = await api.get(`/blog/tags?locale=${locale}`);
    return z.string().array().parse(data.data);
  }
}
