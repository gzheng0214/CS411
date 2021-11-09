module.exports = {
  reactStrictMode: true,
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: "http://localhost:5000/:path*",
    },
  ],
};
