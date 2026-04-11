"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

function MenuIcon() {
	return (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
			<path
				fillRule="evenodd"
				d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
				clipRule="evenodd"
			/>
		</svg>
	);
}

function CloseIcon() {
	return (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
			<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
		</svg>
	);
}

const linkStyle: React.CSSProperties = {
	fontSize: "0.9375rem",
	fontWeight: 500,
	padding: "0.75rem 0",
	textDecoration: "none",
	color: "inherit",
	borderBottom: "1px solid rgba(128,128,128,0.15)",
	display: "block",
};

function isDarkMode() {
	if (typeof document === "undefined") return false;
	return document.documentElement.classList.contains("dark") ||
		(!document.documentElement.classList.contains("light") &&
			window.matchMedia("(prefers-color-scheme: dark)").matches);
}

export function MobileMenuButton({
	className,
}: {
	className?: string;
}) {
	const [open, setOpen] = useState(false);
	const [dark, setDark] = useState(false);

	useEffect(() => {
		if (open) {
			setDark(isDarkMode());
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = "";
			};
		}
	}, [open]);

	return (
		<>
			<button
				onClick={() => setOpen(!open)}
				className={className}
				aria-label={open ? "Close menu" : "Open menu"}
			>
				{open ? <CloseIcon /> : <MenuIcon />}
			</button>

			{open &&
				createPortal(
					<div
						style={{
							position: "fixed",
							top: 60,
							left: 0,
							right: 0,
							bottom: 0,
							zIndex: 100,
							background: dark ? "#0a0a0a" : "#ffffff",
						}}
						onClick={() => setOpen(false)}
					>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								padding: "1rem 1.5rem",
								color: dark ? "#ededed" : "#0a0a0a",
							}}
							onClick={(e) => e.stopPropagation()}
						>
							<a href="/docs" style={linkStyle} onClick={() => setOpen(false)}>
								Learn
							</a>
							<a href="/docs/components/accordion" style={linkStyle} onClick={() => setOpen(false)}>
								Components
							</a>
							<a
								href="https://www.npmjs.com/package/@wire-ui/react"
								target="_blank"
								rel="noopener noreferrer"
								style={linkStyle}
								onClick={() => setOpen(false)}
							>
								npm
							</a>
							<a
								href="https://x.com/wireuijs"
								target="_blank"
								rel="noopener noreferrer"
								style={linkStyle}
								onClick={() => setOpen(false)}
							>
								X (Twitter)
							</a>
							<a
								href="https://github.com/wire-ui/wire-ui"
								target="_blank"
								rel="noopener noreferrer"
								style={{ ...linkStyle, borderBottom: "none" }}
								onClick={() => setOpen(false)}
							>
								GitHub
							</a>
						</div>
					</div>,
					document.body,
				)}
		</>
	);
}
