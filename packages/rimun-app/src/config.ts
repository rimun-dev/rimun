export const API_ENDPOINT =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:3000/trpc"
    : "/api/trpc";

export const STORE_VERSION = "5.0.0";

export const CDN_ENDPOINT = "https://static.rimun.com";
