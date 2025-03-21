import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      process.env.SUPABASE_URL?.replace(/^https?:\/\//, '') || 'qfpygaqyldmthqakmisq.supabase.co',
    ],
  },
};

export default nextConfig;
//$env:PORT=3000; npm run dev
