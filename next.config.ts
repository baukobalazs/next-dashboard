// next.config.js
const nextConfig = {
  webpack: (config: any) => {
    config.module.rules.push({
      test: /\.m?js$/,
      include: /@mui/,
      type: 'javascript/auto',
    });
    return config;
  },
   turbopack: {
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
};

module.exports = nextConfig;

