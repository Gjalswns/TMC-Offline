/** @type {import('next').NextConfig} */
const nextConfig = {
  // 외부 접속 허용
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // 모든 IP에서 접속 허용
  async rewrites() {
    return []
  },
}

module.exports = nextConfig