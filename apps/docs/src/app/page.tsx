import Image from 'next/image'
import Link from 'next/link'
import s from './page.module.css'

const FEATURES = [
  {
    icon: '🎨',
    title: 'Unstyled by default',
    desc: 'Zero CSS shipped. No design opinions baked in. You own every pixel of your design system.',
  },
  {
    icon: '📡',
    title: 'State via data-* attributes',
    desc: 'Every interactive state — hover, focus, active, disabled, open — exposed as a data attribute. Style with plain CSS.',
  },
  {
    icon: '🧩',
    title: 'Compound components',
    desc: 'Complex widgets follow the Component.Part pattern so you control markup order and nesting.',
  },
  {
    icon: '🔷',
    title: 'TypeScript first',
    desc: 'Full type safety across every component and prop. Autocomplete, narrowing, and no any escapes.',
  },
  {
    icon: '🔁',
    title: 'asChild polymorphism',
    desc: 'Merge all behaviour onto your own element — perfect for router links, icon buttons, and custom wrappers.',
  },
  {
    icon: '✅',
    title: 'Consumer-owned validation',
    desc: 'Form components expose invalidType and errorMessage but never validate internally. Your logic, your rules.',
  },
]

const AUTHOR_TAGS = ['React', 'Vue', 'TypeScript', 'Headless UI']

export default function HomePage() {
  return (
    <div className={s.page}>

      {/* ── Nav ──────────────────────────────────────────────── */}
      <nav className={s.nav}>
        <Link href="/" className={s.navLogo}>wire-ui</Link>
        <div className={s.navLinks}>
          <Link href="/docs" className={s.navLink}>Docs</Link>
          <Link href="/docs/components/button" className={s.navLink}>Components</Link>
          <a
            href="https://github.com/wire-ui/wire-ui"
            target="_blank"
            rel="noopener noreferrer"
            className={`${s.navLink} ${s.navLinkGh}`}
          >
            <GitHubIcon />
            GitHub
          </a>
        </div>
      </nav>

      {/* ── Section 1 · Hero ─────────────────────────────────── */}
      <section className={s.hero}>
        <div className={s.heroBadge}>
          <span>⚡</span>
          React 19 · Headless · Zero CSS
        </div>

        <h1 className={s.heroTitle}>
          Core building blocks<br />
          for your <span>design system</span>
        </h1>

        <p className={s.heroSub}>
          Unstyled, accessible React 19 primitives. Style everything with your
          own CSS using <code>data-*</code> attributes that reflect interactive state.
        </p>

        <div className={s.heroCtas}>
          <Link href="/docs/getting-started" className={s.ctaPrimary}>
            Get started →
          </Link>
          <a
            href="https://github.com/wire-ui/wire-ui"
            target="_blank"
            rel="noopener noreferrer"
            className={s.ctaSecondary}
          >
            <GitHubIcon /> GitHub
          </a>
        </div>

        {/* Code window */}
        <div className={s.codeWindow}>
          <div className={s.codeWindowBar}>
            <span className={`${s.dot} ${s.dotRed}`} />
            <span className={`${s.dot} ${s.dotYellow}`} />
            <span className={`${s.dot} ${s.dotGreen}`} />
            <span className={s.codeWindowFile}>App.tsx</span>
          </div>
          <pre className={s.codeBlock}>
            <code>{`import { Button } from '@wire-ui/react'

export default function App() {
  return (
    <Button
      className="
        px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium
        [data-hover]:bg-indigo-700
        [data-active]:scale-95
        [data-focus-visible]:ring-2 [data-focus-visible]:ring-indigo-500
        [data-disabled]:opacity-40 [data-disabled]:cursor-not-allowed
      "
    >
      Save changes
    </Button>
  )
}`}</code>
          </pre>
        </div>
      </section>

      <hr className={s.divider} />

      {/* ── Section 2 · Author ───────────────────────────────── */}
      <section className={`${s.section} ${s.authorSection}`}>
        <p className={s.sectionLabel}>Built by</p>
        <h2 className={s.sectionHeading}>The person behind wire-ui</h2>
        <p className={s.sectionSub}>
          Designed and built by a senior frontend engineer who got tired of
          fighting component library styles.
        </p>

        <div className={s.authorCard}>
          <div className={s.authorAvatar}>
            <Image
              src="/images/authors/jao.png"
              alt="Jao"
              width={64}
              height={64}
              style={{ borderRadius: '50%', objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </div>
          <div>
            <div className={s.authorName}>Jao</div>
            <div className={s.authorRole}>Sr. Frontend Engineer</div>
            <div className={s.authorTags}>
              {AUTHOR_TAGS.map((tag) => (
                <span key={tag} className={s.authorTag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className={s.divider} />

      {/* ── Section 3 · DX ───────────────────────────────────── */}
      <section className={s.section}>
        <p className={s.sectionLabel}>Developer experience</p>
        <div className={s.dxGrid}>
          <div>
            <h2 className={s.sectionHeading}>
              Developer experience<br />to love
            </h2>
            <p className={s.sectionSub} style={{ margin: '0 0 2rem', textAlign: 'left' }}>
              Develop with an open, thought-out API that stays out of your way.
            </p>
            <div className={s.dxFeatures}>
              {FEATURES.map((f) => (
                <div key={f.title} className={s.dxFeature}>
                  <div className={s.dxFeatureIcon}>{f.icon}</div>
                  <div>
                    <div className={s.dxFeatureTitle}>{f.title}</div>
                    <div className={s.dxFeatureDesc}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code window — right column */}
          <div className={s.codeWindow} style={{ position: 'sticky', top: '80px' }}>
            <div className={s.codeWindowBar}>
              <span className={`${s.dot} ${s.dotRed}`} />
              <span className={`${s.dot} ${s.dotYellow}`} />
              <span className={`${s.dot} ${s.dotGreen}`} />
              <span className={s.codeWindowFile}>Modal.tsx</span>
            </div>
            <pre className={s.codeBlock}>
              <code>{`import { Modal } from '@wire-ui/react'

<Modal>
  {/* Trigger — any element */}
  <Modal.Trigger asChild>
    <button className="btn">Open</button>
  </Modal.Trigger>

  {/* Backdrop */}
  <Modal.Backdrop className="
    fixed inset-0 bg-black/50
    [data-open]:opacity-100
    [data-closed]:opacity-0
  " />

  {/* Panel */}
  <Modal.Panel className="
    fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
    bg-white rounded-xl shadow-xl p-6 w-full max-w-md
    [data-open]:scale-100
    [data-closed]:scale-95
  ">
    <Modal.Title>Are you sure?</Modal.Title>
    <Modal.Description>This cannot be undone.</Modal.Description>
    <Modal.Close asChild>
      <button className="btn-danger">Confirm</button>
    </Modal.Close>
  </Modal.Panel>
</Modal>`}</code>
            </pre>
          </div>
        </div>
      </section>

      <hr className={s.divider} />

      {/* ── Section 4 · Community ────────────────────────────── */}
      <section className={`${s.section} ${s.communitySection}`}>
        <span className={s.communityEmoji}>👋</span>
        <h2 className={s.sectionHeading}>An active and friendly community</h2>
        <p className={s.sectionSub}>Join our fast-growing community</p>

        <a
          href="https://github.com/wire-ui/wire-ui"
          target="_blank"
          rel="noopener noreferrer"
          className={s.ghCard}
        >
          <div className={s.ghCardLeft}>
            <div className={s.ghIcon}>
              <GitHubIcon color="#fff" size={20} />
            </div>
            <div>
              <div className={s.ghCardTitle}>GitHub</div>
              <div className={s.ghCardSub}>wire-ui/wire-ui</div>
            </div>
          </div>
          <span className={s.ghArrow}>→</span>
        </a>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className={s.footer}>
        <span>wire-ui</span>
        <span>MIT License © {new Date().getFullYear()}</span>
      </footer>

    </div>
  )
}

/* ── Icons ───────────────────────────────────────────────────── */
function GitHubIcon({ color = 'currentColor', size = 16 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}
