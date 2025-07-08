import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qfpygaqyldmthqakmisq.supabase.co',
        pathname: "/storage/v1/object/public/tiviai-images/**",
      },
   
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;


//https://qfpygaqyldmthqakmisq.supabase.co/storage/v1/object/public/tiviai-images/capa-livro/1751847364797-ChatGPT-Image-29-de-jun.-de-2025-143421.png
//https://         dmthqakmisq.supabase.co/storage/v1/object/public/capas/capa-livro/1751847364797-ChatGPT-Image-29-de-jun.-de-2025-143421.png