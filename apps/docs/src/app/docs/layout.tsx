import Image from "next/image";
import { Banner } from "nextra/components";
import { Layout, Navbar } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import { DocsProviders } from "../../components/docs-providers";
import { FrameworkSwitcher } from "../../components/framework-switcher";
import s from "./logo.module.css";

function NpmIcon() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden
		>
			<path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0h-2.666V8.667h5.334v5.332h-2.668v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM11.332 12v-1.333h1.336V12h-1.336z" />
		</svg>
	);
}

export default async function DocsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pageMap = await getPageMap("/docs");

	const navbar = (
		<Navbar
			logo={
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "16px",
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "8px",
						}}
					>
						<Image
							src="/images/logo/wire-ui-logo.svg"
							alt="Wire UI"
							width={28}
							height={28}
							className={s.logo}
						/>
						<span className={s.logoText}>Wire UI</span>
					</div>
					<div className="framework-switcher-desktop">
						<FrameworkSwitcher />
					</div>
				</div>
			}
			projectLink="https://github.com/wire-ui/wire-ui"
		>
			<a
				href="https://www.npmjs.com/package/@wire-ui/react"
				target="_blank"
				rel="noopener noreferrer"
				style={{
					display: "flex",
					alignItems: "center",
					color: "currentColor",
				}}
			>
				<NpmIcon />
			</a>
		</Navbar>
	);

	return (
		<DocsProviders>
			<Layout
				banner={
					<Banner
						className="bg-[#6366f1]"
						storageKey="star-banner"
						dismissible={false}
					>
						<a
							href="https://github.com/wire-ui/wire-ui"
							target="_blank"
							rel="noopener noreferrer"
						>
							⭐️ Leave a star →
						</a>
					</Banner>
				}
				navbar={navbar}
				pageMap={pageMap}
				docsRepositoryBase="https://github.com/wire-ui/wire-ui/tree/main/apps/docs"
				sidebar={{ defaultMenuCollapseLevel: 1 }}
				footer={
					<p
						key="footer"
						style={{
							textAlign: "center",
							fontSize: "0.875rem",
							color: "#888",
						}}
					>
						MIT License © {new Date().getFullYear()} wire-ui
					</p>
				}
			>
				{children}
			</Layout>
		</DocsProviders>
	);
}
