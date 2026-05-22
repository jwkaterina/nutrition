const FIREBASE_API = 'https://us-central1-nutrition-3236d.cloudfunctions.net/app';

const apiRewrites = (base) => [
  { source: '/api/:path*',     destination: `${base}/api/:path*` },
  { source: '/foods/:path*',   destination: `${base}/foods/:path*` },
  { source: '/recipes/:path*', destination: `${base}/recipes/:path*` },
  { source: '/users/:path*',   destination: `${base}/users/:path*` },
  { source: '/menus/:path*',   destination: `${base}/menus/:path*` },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const base = process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : FIREBASE_API;
    return apiRewrites(base);
  },
};

module.exports = nextConfig;
