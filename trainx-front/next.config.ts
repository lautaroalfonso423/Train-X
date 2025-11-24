import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname, // fuerza a que Turbopack use esta carpeta como raíz
  },
   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**", // permite cualquier path bajo este dominio
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**", // permite cualquier path de Cloudinary
      },
    ],
  },
};

export default nextConfig;
