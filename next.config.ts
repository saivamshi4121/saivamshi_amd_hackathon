import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Docker / Cloud Run: produces a minimal standalone build
  output: "standalone",
};

export default nextConfig;
