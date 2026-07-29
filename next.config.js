const BACKEND_BASE = '/api/backend';

const apiRewrites = [
  { source: '/api',            destination: `${BACKEND_BASE}/api` },
  { source: '/api/:path*',     destination: `${BACKEND_BASE}/api/:path*` },
  { source: '/foods',          destination: `${BACKEND_BASE}/foods` },
  { source: '/foods/:path*',   destination: `${BACKEND_BASE}/foods/:path*` },
  { source: '/recipes',        destination: `${BACKEND_BASE}/recipes` },
  { source: '/recipes/:path*', destination: `${BACKEND_BASE}/recipes/:path*` },
  { source: '/users',          destination: `${BACKEND_BASE}/users` },
  { source: '/users/:path*',   destination: `${BACKEND_BASE}/users/:path*` },
  { source: '/menus',          destination: `${BACKEND_BASE}/menus` },
  { source: '/menus/:path*',   destination: `${BACKEND_BASE}/menus/:path*` },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return apiRewrites;
  },
};

module.exports = nextConfig;
