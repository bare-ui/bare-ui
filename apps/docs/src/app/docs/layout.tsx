import Image from "next/image";
import { cookies } from "next/headers";
import { Banner } from "nextra/components";
import { Layout, Navbar } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import { DocsProviders } from "../../components/docs-providers";
import { FrameworkSwitcher } from "../../components/framework-switcher";
import s from "./logo.module.css";

const FRAMEWORK_COOKIE = "wire-ui-framework";
const DEFAULT_FRAMEWORK = "react";

// Recursively prepend `/{framework}` to every `route` in the pageMap
// so Nextra's sidebar active-state matching works with our rewritten URLs.
// deno-lint-ignore no-explicit-any
function prefixPageMapRoutes(items: any[], prefix: string): any[] {
	return items.map((item) => {
		const next = { ...item };
		if (typeof next.route === "string" && next.route.startsWith("/docs")) {
			next.route = `${prefix}${next.route}`;
		}
		if (Array.isArray(next.children)) {
			next.children = prefixPageMapRoutes(next.children, prefix);
		}
		return next;
	});
}

function XIcon() {
	return (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
			<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
		</svg>
	);
}

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
	const rawPageMap = await getPageMap("/docs");

	// Determine framework from cookie (set by middleware) so the sidebar's
	// active-state matches the browser URL (/react/docs/... or /vue/docs/...)
	const cookieStore = await cookies();
	const framework =
		cookieStore.get(FRAMEWORK_COOKIE)?.value || DEFAULT_FRAMEWORK;
	const pageMap = prefixPageMapRoutes(rawPageMap, `/${framework}`);

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
				href="https://www.npmjs.com/org/wire-ui"
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
			<a
				href="https://x.com/wireuijs"
				target="_blank"
				rel="noopener noreferrer"
				style={{
					display: "flex",
					alignItems: "center",
					color: "currentColor",
				}}
			>
				<XIcon />
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
