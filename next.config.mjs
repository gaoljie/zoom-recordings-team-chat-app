/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'",
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "ngrok-skip-browser-warning", value: "1" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
      {
        source: "/form",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "script-src https://zoom-chat-demo.vercel.app/ 'unsafe-inline'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
