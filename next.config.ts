import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Reuse recently visited pages on back/home navigation. Keep the same
    // short window for full prefetches, whose default lifetime is five minutes.
    staleTimes: { dynamic: 30, static: 30 },
  },
};

export default nextConfig;
