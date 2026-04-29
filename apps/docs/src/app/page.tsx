import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../components/theme-toggle";
import { ScrambleText } from "../components/scramble-text";
import { Hero3DWrapper } from "../components/hero-3d-wrapper";
import { CharGridBg } from "../components/char-grid-bg";
import { GitHubStars, NpmDownloads } from "../components/stats-badges";
import { MobileMenuButton } from "../components/mobile-nav";
import { AIPipeline } from "../components/ai-pipeline";
import { LiveCodeWindow } from "../components/live-code-window";
import { FeatureMatrix } from "../components/feature-matrix";
import { METADATA } from "../data/benchmarks";
import s from "./page.module.css";

const FEATURES = [
	{
		icon: "🤖",
		title: "AI-native",
		desc: "AI-integrated docs with llms.txt, machine-readable API references, and MCP server support. Built for AI-assisted workflows.",
	},
	{
		icon: "🎨",
		title: "Unstyled primitives",
		desc: "Zero CSS shipped. No design opinions. Every component is a bare building block — you own every pixel.",
	},
	{
		icon: "🧩",
		title: "Compound components",
		desc: "Complex widgets follow the Component.Part pattern so you control markup order and nesting.",
	},
	{
		icon: "📡",
		title: "State via data-* attributes",
		desc: "Every interactive state — hover, focus, active, disabled, open — exposed as a data attribute. Style with plain CSS.",
	},
	{
		icon: "🔁",
		title: "asChild polymorphism",
		desc: "Merge all behaviour onto your own element — perfect for router links, icon buttons, and custom wrappers.",
	},
	{
		icon: "✅",
		title: "Consumer-owned validation",
		desc: "Form components expose invalidType and errorMessage but never validate internally. Your logic, your rules.",
	},
];

export default function HomePage() {
	return (
		<div className={s.page}>
			<CharGridBg className={s.pageBackground} />

			{/* ── Nav ──────────────────────────────────────────────── */}
			<nav className={s.nav}>
				<Link href="/" className={s.navLogo}>
					<Image
						src="/images/logo/wire-ui-logo.svg"
						alt="Wire UI"
						width={28}
						height={28}
						className={s.navLogoImg}
					/>
					<span className={s.navLogoText}>Wire UI</span>
				</Link>
				<div className={s.navLinks}>
					<Link href="/docs" className={s.navLink}>
						Learn
					</Link>
					<Link
						href="/docs/components/accordion"
						className={s.navLink}
					>
						Components
					</Link>
					<a
						href="https://www.npmjs.com/org/wire-ui"
						target="_blank"
						rel="noopener noreferrer"
						className={`${s.navLink} ${s.navLinkGh}`}
					>
						<NpmIcon size={20} />
					</a>
					<a
						href="https://x.com/wireuijs"
						target="_blank"
						rel="noopener noreferrer"
						className={`${s.navLink} ${s.navLinkGh}`}
					>
						<XIcon size={18} />
					</a>
					<a
						href="https://github.com/wire-ui/wire-ui"
						target="_blank"
						rel="noopener noreferrer"
						className={`${s.navLink} ${s.navLinkGh}`}
					>
						<GitHubIcon size={20} />
					</a>
					<ThemeToggle className={s.themeToggle} />
				</div>
				<div className={s.mobileNav}>
					<ThemeToggle className={s.themeToggle} />
					<MobileMenuButton className={s.mobileMenuBtn} />
				</div>
			</nav>

			{/* ── Section 1 · Hero ─────────────────────────────────── */}
			<section className={s.hero}>
				<Hero3DWrapper className={s.heroCanvas} />

				<div className={s.heroContent}>
					<div className={s.heroBadge}>
						<span>⚡</span>
						AI-native · Unstyled · Compound components
					</div>

					<h1 className={s.heroTitle}>
						<ScrambleText text="The " />
						<ScrambleText
							text="AI-native"
							delay={100}
							className={s.heroTitleGradient}
						/>
						<ScrambleText text=" unstyled" delay={200} />
						<br />
						<ScrambleText text="primitives framework" delay={300} />
					</h1>

					<p className={s.heroSub}>
						Headless, compound components with AI-integrated docs.
						Zero CSS shipped — style everything through{" "}
						<code>data-*</code> attributes that reflect interactive
						state.
					</p>

					<div className={s.heroCtas}>
						<Link href="/docs" className={s.ctaPrimary}>
							Get started →
						</Link>
						<a
							href="https://github.com/wire-ui/wire-ui"
							target="_blank"
							rel="noopener noreferrer"
							className={s.ctaSecondary}
						>
							<GitHubIcon />
							<span className={s.ctaBadge}>
								★ <GitHubStars />
							</span>
						</a>
					</div>
					<div className={s.heroFrameworks}>
						<a
							href="https://www.npmjs.com/package/@wire-ui/react"
							target="_blank"
							rel="noopener noreferrer"
							className={s.frameworkPill}
						>
							<ReactIcon /> React
							<span className={s.ctaBadge}>
								↓ <NpmDownloads pkg="@wire-ui/react" />
							</span>
						</a>
						<a
							href="https://www.npmjs.com/package/@wire-ui/vue"
							target="_blank"
							rel="noopener noreferrer"
							className={s.frameworkPill}
						>
							<VueIcon /> Vue
							<span className={s.ctaBadge}>
								↓ <NpmDownloads pkg="@wire-ui/vue" />
							</span>
						</a>
						<a
							href="https://www.npmjs.com/package/@wire-ui/solid"
							target="_blank"
							rel="noopener noreferrer"
							className={s.frameworkPill}
						>
							<SolidIcon /> Solid
							<span className={s.ctaBadge}>
								↓ <NpmDownloads pkg="@wire-ui/solid" />
							</span>
						</a>
					</div>
				</div>
			</section>

			<hr className={s.divider} />

			{/* ── Section 2 · AI Pipeline ────────────────────────── */}
			<AIPipeline />

			<hr className={s.divider} />

			{/* ── Section 3 · DX ───────────────────────────────────── */}
			<section className={s.section}>
				<div className={s.dxGrid}>
					<div>
						<p className={s.sectionLabel}>Developer experience</p>
						<h2 className={s.sectionHeading}>
							Developer experience
							<br />
							to love
						</h2>
						<p
							className={s.sectionSub}
							style={{ margin: "0 0 2rem", textAlign: "left" }}
						>
							Develop with an open, thought-out API that stays out
							of your way.
						</p>
						<div className={s.dxFeatures}>
							{FEATURES.map((f) => (
								<div key={f.title} className={s.dxFeature}>
									<div className={s.dxFeatureIcon}>
										{f.icon}
									</div>
									<div>
										<div className={s.dxFeatureTitle}>
											{f.title}
										</div>
										<div className={s.dxFeatureDesc}>
											{f.desc}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Code window — right column */}
					<LiveCodeWindow
						style={{ position: "sticky", top: "80px" }}
						code={{
							react: `import { Dropdown } from '@wire-ui/react'

export const UserMenu = () => {
  const handleSelect = (action: string) => {
    console.log('selected:', action)
  }

  return (
    <Dropdown.Root>
      <Dropdown.Trigger>Open Menu</Dropdown.Trigger>
      <Dropdown.Menu>
        <div onClick={() => handleSelect('profile')}>Profile</div>
        <div onClick={() => handleSelect('settings')}>Settings</div>
        <div onClick={() => handleSelect('signout')}>Sign out</div>
      </Dropdown.Menu>
    </Dropdown.Root>
  )
}`,
							vue: `<script setup lang="ts">
import { DropdownRoot, DropdownTrigger, DropdownMenu } from '@wire-ui/vue'

const handleSelect = (action: string) => {
  console.log('selected:', action)
}
</script>

<template>
  <DropdownRoot>
    <DropdownTrigger>Open Menu</DropdownTrigger>
    <DropdownMenu>
      <div @click="handleSelect('profile')">Profile</div>
      <div @click="handleSelect('settings')">Settings</div>
      <div @click="handleSelect('signout')">Sign out</div>
    </DropdownMenu>
  </DropdownRoot>
</template>`,
							solid: `import { Dropdown } from '@wire-ui/solid'

export const UserMenu = () => {
  const handleSelect = (action: string) => {
    console.log('selected:', action)
  }

  return (
    <Dropdown.Root>
      <Dropdown.Trigger>Open Menu</Dropdown.Trigger>
      <Dropdown.Menu>
        <div onClick={() => handleSelect('profile')}>Profile</div>
        <div onClick={() => handleSelect('settings')}>Settings</div>
        <div onClick={() => handleSelect('signout')}>Sign out</div>
      </Dropdown.Menu>
    </Dropdown.Root>
  )
}`,
						}}
					/>
				</div>
			</section>

			<hr className={s.divider} />

			{/* ── Section 4 · Full Capability Matrix ──────────────── */}
			<section className={`${s.section} ${s.matrixSection}`}>
				<p className={s.sectionLabel}>Wire UI vs the headless landscape</p>
				<h2 className={s.sectionHeading}>Every feature, side by side</h2>
				<p className={s.sectionSub}>
					Honest comparison against the major headless component
					libraries. Where we win, where we tie, and where the field
					beats us.
				</p>
				<FeatureMatrix />
				<p className={s.matrixFootnote}>
					Data captured {METADATA.capturedAt}. {METADATA.note}{" "}
					<a
						href="https://github.com/wire-ui/wire-ui/issues/new?title=Benchmark+correction&body=Which+library+or+feature+needs+updating%3F%0A%0A"
						target="_blank"
						rel="noopener noreferrer"
					>
						Submit a correction →
					</a>
				</p>
			</section>

			<hr className={s.divider} />

			{/* ── Section 5 · Community ────────────────────────────── */}
			<section className={`${s.section} ${s.communitySection}`}>
				<span className={s.communityEmoji}>👋</span>
				<h2 className={s.sectionHeading}>
					An active and friendly community
				</h2>
				<p className={s.sectionSub}>Join our fast-growing community</p>

				<div className={s.communityCards}>
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
								<div className={s.ghCardSub}>
									wire-ui/wire-ui
								</div>
							</div>
						</div>
						<span className={s.ghArrow}>→</span>
					</a>
					<a
						href="https://x.com/wireuijs"
						target="_blank"
						rel="noopener noreferrer"
						className={s.ghCard}
					>
						<div className={s.ghCardLeft}>
							<div className={s.ghIcon}>
								<XIcon size={18} />
							</div>
							<div>
								<div className={s.ghCardTitle}>X (Twitter)</div>
								<div className={s.ghCardSub}>@wireuijs</div>
							</div>
						</div>
						<span className={s.ghArrow}>→</span>
					</a>
				</div>
			</section>

			{/* ── Footer ───────────────────────────────────────────── */}
			<footer className={s.footer}>
				<span>wire-ui</span>
				<span>MIT License © {new Date().getFullYear()}</span>
			</footer>
		</div>
	);
}

/* ── Icons ───────────────────────────────────────────────────── */
function GitHubIcon({
	color = "currentColor",
	size = 16,
}: {
	color?: string;
	size?: number;
}) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill={color}
			aria-hidden
		>
			<path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
		</svg>
	);
}

function ReactIcon({ size = 16 }: { size?: number }) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="-11.5 -10.232 23 20.463"
			fill="currentColor"
			aria-hidden
		>
			<circle r="2.05" />
			<g stroke="currentColor" strokeWidth="1" fill="none">
				<ellipse rx="11" ry="4.2" />
				<ellipse rx="11" ry="4.2" transform="rotate(60)" />
				<ellipse rx="11" ry="4.2" transform="rotate(120)" />
			</g>
		</svg>
	);
}

function VueIcon({ size = 16 }: { size?: number }) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden
		>
			<path d="M2 3h3.5L12 14.5 18.5 3H22L12 21 2 3z" />
			<path d="M6.5 3H12l-6 10.5L2 3h4.5z" opacity="0.5" />
			<path d="M17.5 3H12l6 10.5L22 3h-4.5z" opacity="0.5" />
		</svg>
	);
}

function SolidIcon({ size = 16 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 166 155.3" aria-hidden>
			<path
				d="M163 35S110-4 69 5l-3 1c-6 2-11 5-14 9l-2 3-15 26 26 5c11 7 25 10 38 7l46 9 18-30z"
				fill="currentColor"
				opacity="0.5"
			/>
			<path
				d="M52 35l-4 1c-17 5-22 21-13 35 10 13 31 20 48 15l62-21S92 26 52 35z"
				fill="currentColor"
				opacity="0.7"
			/>
			<path
				d="M134 80a45 45 0 00-48-15L24 85 4 120l112 19 20-36c4-7 3-15-2-23z"
				fill="currentColor"
				opacity="0.85"
			/>
			<path
				d="M114 115a45 45 0 00-48-15L4 120s53 40 94 30l3-1c17-5 23-21 13-34z"
				fill="currentColor"
			/>
		</svg>
	);
}

function NpmIcon({ size = 16 }: { size?: number }) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden
		>
			<path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z" />
		</svg>
	);
}

function XIcon({ size = 16 }: { size?: number }) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden
		>
			<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
		</svg>
	);
}
