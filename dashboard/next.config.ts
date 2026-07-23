import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: 'build',
  env: {
    NEXTAUTH_URL: 'https://patching-dashboard-hae3f7fxc6fnhhbt.canadacentral-01.azurewebsites.net'
  }
};

export default nextConfig;
