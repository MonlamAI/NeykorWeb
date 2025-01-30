import createNextIntlPlugin from "next-intl/plugin";

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
    ],
  },
};

export default withNextIntl(nextConfig);
