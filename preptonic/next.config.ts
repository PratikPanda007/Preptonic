import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // output: 'export',
  trailingSlash: true, // optional: adds slashes to all routes (helps with Azure or S3 style hosting)
};

export default nextConfig;
