import createNextIntlPlugin from "next-intl/plugin";
import TerserPlugin from "terser-webpack-plugin";
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gompa-tour.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/media/images/**",
      },
      {
        protocol: "https",
        hostname: "monlam-ai-web-testing.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify:true,
  experimental:{
    optimizeCss:true
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // Remove console logs
              drop_debugger: true,
            },
            output: {
              comments: false, // Remove comments
            },
          },
        }),
      ];
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
