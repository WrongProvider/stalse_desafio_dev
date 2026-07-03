import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [
      {
        source: "/",
        destination: "/tickets",
        permanent: true, // Define como redirecionamento 301 (permanente), ótimo para performance
      },
    ];
  },
};

export default nextConfig;
