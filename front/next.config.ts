import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Keep Turbopack scoped to this app instead of the parent workspace.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
