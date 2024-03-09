const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
 
module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
        ...defaultConfig,
        async rewrites() {
            return [
              {
                source: '/api/:path*',
                destination: 'http://localhost:5001/api/:path*'
              },
              {
                source: '/foods/:path*',
                destination: 'http://localhost:5001/foods/:path*'
              },
              {
                source: '/recipes/:path*',
                destination: 'http://localhost:5001/recipes/:path*'
              },
              {
                source: '/users/:path*',
                destination: 'http://localhost:5001/users/:path*'
              },
              {
                source: '/menus/:path*',
                destination: 'http://localhost:5001/menus/:path*'
              }
            ]
        }
    }
  }
 
  return {
    ...defaultConfig,
    output: "export",
    reactStrictMode: true,
    swcMinify: true,
    images: {
      unoptimized: true,
    },
  }
}
