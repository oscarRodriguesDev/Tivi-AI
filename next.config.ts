import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qfpygaqyldmthqakmisq.supabase.co',
        pathname: '/storage/v1/object/public/tiviai-images/**',
      },
    ],
  },
  // Caso queira aumentar o limite de upload, adicione isso no arquivo
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',  // Ajusta o limite para 10MB ou conforme sua necessidade
    },
  },
};

export default nextConfig;
