const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

const FIREBASE_API = 'https://us-central1-nutrition-3236d.cloudfunctions.net/app';

const apiRewrites = (base) => [
  { source: '/api/:path*',     destination: `${base}/api/:path*` },
  { source: '/foods/:path*',   destination: `${base}/foods/:path*` },
  { source: '/recipes/:path*', destination: `${base}/recipes/:path*` },
  { source: '/users/:path*',   destination: `${base}/users/:path*` },
  { source: '/menus/:path*',   destination: `${base}/menus/:path*` },
];

module.exports = (phase, { defaultConfig }) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    ...defaultConfig,
    reactStrictMode: true,
    async rewrites() {
      return apiRewrites(isDev ? 'http://localhost:5001' : FIREBASE_API);
    },
  };
};
