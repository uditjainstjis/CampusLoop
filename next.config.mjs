/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'picsum.photos',
          pathname: '/**', // Allow all paths under this hostname
        },
        {
          protocol: 'https',
          hostname: 'assets.aceternity.com',
          pathname: '/*', // Allow all paths under this hostname
        },
      ],
    },
  };
  
  export default nextConfig;