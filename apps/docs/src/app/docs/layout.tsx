import { Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

export default async function DocsLayout({ children }: { children: React.ReactNode }) {
  const pageMap = await getPageMap('/docs')

  const navbar = (
    <Navbar
      logo={
        <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
          bareui
        </span>
      }
      projectLink="https://github.com/bare-ui/bare-ui"
    />
  )

  return (
    <html lang="en" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/bare-ui/bare-ui/tree/main/apps/docs"
          footer={
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#888' }}>
              MIT License © {new Date().getFullYear()} bareui
            </p>
          }
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
