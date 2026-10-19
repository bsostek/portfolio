import type { NextConfig } from "next";

// GITHUB_PAGES=1 builds a static export for bsostek.github.io. API routes are
// named route.api.ts so they're only picked up by the regular (Vercel) build;
// the static site calls them on Vercel instead (see lib/api.ts).
const isPagesBuild = process.env.GITHUB_PAGES === "1";

const PAGES_ORIGIN = "https://bsostek.github.io";

const nextConfig: NextConfig = isPagesBuild
  ? {
      output: "export",
      pageExtensions: ["tsx", "ts"],
      images: { unoptimized: true },
    }
  : {
      pageExtensions: ["tsx", "ts", "api.ts"],
      async headers() {
        return [
          {
            source: "/api/:path*",
            headers: [
              { key: "Access-Control-Allow-Origin", value: PAGES_ORIGIN },
              { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
              { key: "Access-Control-Allow-Headers", value: "Content-Type" },
            ],
          },
        ];
      },
    };

export default nextConfig;
