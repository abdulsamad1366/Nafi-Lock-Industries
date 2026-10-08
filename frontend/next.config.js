/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5001",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "nafi-lock-api.onrender.com",
        pathname: "/uploads/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/distributor/ledger",
        destination: "/distributor",
        permanent: false,
      },
      {
        source: "/distributor/cart",
        destination: "/distributor/orders/new",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
