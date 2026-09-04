import { z } from "zod";
import { locales } from "@/i18n/routing";

export const localeSchema = z.enum(locales);
