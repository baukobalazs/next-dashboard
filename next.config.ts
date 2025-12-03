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
};

module.exports = nextConfig;

