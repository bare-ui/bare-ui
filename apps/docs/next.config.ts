import nextra from 'nextra'

const withNextra = nextra({
  contentDirBasePath: '/docs',
})

export default withNextra({
  images: { unoptimized: true },
  async rewrites() {
    return [
      {
        source: '/:framework(react|vue|solid)/docs/:path*',
        destination: '/docs/:path*',
      },
      {
        source: '/:framework(react|vue|solid)/docs',
        destination: '/docs',
      },
    ]
  },
})
