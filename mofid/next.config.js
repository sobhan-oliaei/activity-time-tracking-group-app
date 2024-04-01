/** @type {import('next').NextConfig} */
// const withPWA = require('next-pwa')({
//     dest: 'public',
//     disable: process.env.NODE_ENV === 'development'
//   })
// const nextConfig = {
//     // output: 'export',
//     // images: {
//     //     loader: 'custom',
//     //     loaderFile: './my-loader.ts',
//     //   },
// }

// module.exports = withPWA({
//     // next.js config
//     // output: 'export',
//     // images: {
//     //     loader: 'custom',
//     //     loaderFile: './my-loader.ts',
//     //   },
//   })


  const nextConfig = {
    output: 'export',
    images: {
      unoptimized: true,
    },
  }
  
  module.exports = nextConfig