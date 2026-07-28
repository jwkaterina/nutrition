const FIREBASE_API = 'https://us-central1-nutrition-3236d.cloudfunctions.net/app';

const apiRewrites = (base) => [
  { source: '/api',            destination: `${base}/api` },
  { source: '/api/:path*',     destination: `${base}/api/:path*` },
  { source: '/foods',          destination: `${base}/foods` },
  { source: '/foods/:path*',   destination: `${base}/foods/:path*` },
  { source: '/recipes',        destination: `${base}/recipes` },
  { source: '/recipes/:path*', destination: `${base}/recipes/:path*` },
  { source: '/users',          destination: `${base}/users` },
  { source: '/users/:path*',   destination: `${base}/users/:path*` },
  { source: '/menus',          destination: `${base}/menus` },
  { source: '/menus/:path*',   destination: `${base}/menus/:path*` },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const base = process.env.NODE_ENV === 'development'
      ? 'http://localhost:5001/nutrition-3236d/us-central1/app'
      : FIREBASE_API;
    return apiRewrites(base);
  },
};

module.exports = nextConfig;
