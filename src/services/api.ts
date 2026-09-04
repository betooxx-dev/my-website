import "server-only";
import axios from "axios";
import { env } from "@/env";

const api = axios.create({
  baseURL: env.ARGOS_API_URL,
  maxBodyLength: 10 * 1024 * 1024,
  maxContentLength: 2 * 1024 * 1024,
  timeout: 5_000,
});

export default api;
