/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: true,
  },
  transpilePackages: ["@el-hodh0d/ui", "@el-hodh0d/types"],
  async rewrites() {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3333";
    return [
      {
        source: "/api/:path*",
        destination: `${base}/:path*`,
      },
    ];
  },
};

export default nextConfig;


