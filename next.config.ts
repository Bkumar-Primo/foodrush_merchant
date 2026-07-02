import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    localPatterns: [
      {
        pathname: "/brand/**",
      },
      {
        pathname: "/food/**",
      },
    ],
  },
  experimental: {
    instantNavigationDevToolsToggle: true,
  },
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
