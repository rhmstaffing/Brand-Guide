/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["passkit-generator", "nodemailer"],
  experimental: { serverActions: { bodySizeLimit: "20mb" } },
};
export default nextConfig;
