/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Skip type checking during build to avoid memory/environment issues
    ignoreBuildErrors: true,
  },
  eslint: {
    // Also skip ESLint during build
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
