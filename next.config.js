/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack: (config) => {
    config.optimization.minimize = false;
    return config;
  },
  swcMinify: false,
};

module.exports = nextConfig;
