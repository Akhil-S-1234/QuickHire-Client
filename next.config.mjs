// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     async rewrites() {

//       return [
//         {
//           source: '/api/:path*',  // This matches any API call that starts with /api
//           destination: 'http://localhost:4000/api/:path*',  // This is where the API calls will be forwarded
//         },
//       ];
//     },
//   };
  
//   export default nextConfig;
  

// next.config.js

export default {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com", // Add this for pinimg.com
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // You already have this
      },
      {
        protocol: "https",
        hostname: "quickhireimg.s3.eu-north-1.amazonaws.com", // For your S3 bucket
      },
    ],
  },
};

  