import type { app } from "@play-github-copilot-workspace/backend";
import { hc } from "hono/client";

export const apiClient = hc<typeof app>(import.meta.env.VITE_BACKEND_URL);
