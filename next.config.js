/** @type {import('next').NextConfig} */

const isGHPages = process.env.GITHUB_PAGES === 'true';
const repoName = process.env.REPO_NAME || 'success-os';

const nextConfig = {
  output: isGHPages ? 'export' : 'standalone',
  basePath: isGHPages ? `/${repoName}` : '',
  assetPrefix: isGHPages ? `/${repoName}/` : undefined,
  distDir: process.env.NODE_ENV === 'production'
    ? (process.env.BUILD_DIR || '.next-build')
    : '.next',
  trailingSlash: true,
  async headers() {
    if (process.env.NODE_ENV !== 'development') {
      return [];
    }
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: '*' },
        ],
      },
    ];
  },
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
