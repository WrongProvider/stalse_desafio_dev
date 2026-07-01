import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
