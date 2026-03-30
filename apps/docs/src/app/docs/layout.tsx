import Image from 'next/image'
import { Layout, Navbar } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import { DocsProviders } from '../../components/docs-providers'
import { FrameworkSwitcher } from '../../components/framework-switcher'
import s from './logo.module.css'

export default async function DocsLayout({ children }: { children: React.ReactNode }) {
  const pageMap = await getPageMap('/docs')

  const navbar = (
    <Navbar
      logo={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Image
            src="/images/logo/wire-ui-logo.svg"
            alt="Wire UI"
            width={28}
            height={28}
            className={s.logo}
          />
          <FrameworkSwitcher />
        </div>
      }
      projectLink="https://github.com/wire-ui/wire-ui"
    />
  )

  return (
    <DocsProviders>
      <Layout
        navbar={navbar}
        pageMap={pageMap}
        docsRepositoryBase="https://github.com/wire-ui/wire-ui/tree/main/apps/docs"
        footer={
          <p key="footer" style={{ textAlign: 'center', fontSize: '0.875rem', color: '#888' }}>
            MIT License © {new Date().getFullYear()} wire-ui
          </p>
        }
      >
        {children}
      </Layout>
    </DocsProviders>
  )
}
