import "server-only";
import axios from "axios";
import { env } from "@/env";

const api = axios.create({
  baseURL: env.ARGOS_API_URL,
});

export default api;
