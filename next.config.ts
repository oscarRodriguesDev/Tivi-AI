import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.SUPABASE_URL?.replace(/^https?:\/\//, '') || 'qfpygaqyldmthqakmisq.supabase.co',
        pathname: '/storage/v1/object/public/tiviai-images/profile-pictures/**', // Ajustado para o caminho correto das imagens
      },
    ],
  },
};

export default nextConfig;
