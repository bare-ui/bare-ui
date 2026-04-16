"use client";

import { useState, useRef, useEffect } from "react";
import { useFramework, type Framework } from "../context/framework-context";

const FRAMEWORKS: { id: Framework; label: string; available: boolean }[] = [
	{ id: "react", label: "React", available: true },
	{ id: "vue", label: "Vue", available: true },
	{ id: "solid", label: "Solid", available: false },
];

export function FrameworkSwitcher() {
	const { framework, setFramework } = useFramework();
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	// Close on outside click
	useEffect(() => {
		if (!open) return;
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [open]);

	// Close on Escape
	useEffect(() => {
		if (!open) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [open]);

	const current = FRAMEWORKS.find((f) => f.id === framework) || FRAMEWORKS[0];

	return (
		<div ref={ref} style={{ position: "relative", display: "inline-block" }}>
			<button
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					setOpen(!open);
				}}
				style={{
					display: "flex",
					alignItems: "center",
					gap: "6px",
					padding: "4px 10px",
					borderRadius: "6px",
					border: "1px solid color-mix(in srgb, currentColor 12%, transparent)",
					background: "color-mix(in srgb, currentColor 4%, transparent)",
					color: "inherit",
					fontSize: "0.75rem",
					fontWeight: 600,
					fontFamily: "inherit",
					cursor: "pointer",
					lineHeight: 1.5,
					transition: "background 0.15s, border-color 0.15s",
					whiteSpace: "nowrap",
				}}
			>
				{current.label}
				<ChevronIcon open={open} />
			</button>

			{open && (
				<div
					style={{
						position: "absolute",
						top: "calc(100% + 4px)",
						left: 0,
						minWidth: "140px",
						borderRadius: "8px",
						border: "1px solid color-mix(in srgb, currentColor 10%, transparent)",
						background: "var(--framework-dropdown-bg, #fff)",
						boxShadow: "0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)",
						padding: "4px",
						zIndex: 200,
						fontSize: "0.8rem",
					}}
				>
					{FRAMEWORKS.map(({ id, label, available }) => {
						const isActive = framework === id;
						return (
							<button
								key={id}
								disabled={!available}
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									if (available) {
										setFramework(id);
										setOpen(false);
									}
								}}
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									width: "100%",
									padding: "6px 10px",
									borderRadius: "5px",
									border: "none",
									background: isActive
										? "color-mix(in srgb, currentColor 8%, transparent)"
										: "transparent",
									color: available
										? "inherit"
										: "color-mix(in srgb, currentColor 35%, transparent)",
									cursor: available ? "pointer" : "not-allowed",
									fontWeight: isActive ? 600 : 400,
									fontSize: "inherit",
									fontFamily: "inherit",
									lineHeight: 1.6,
									transition: "background 0.12s",
									textAlign: "left",
								}}
							>
								<span>{label}</span>
								{!available && (
									<span
										style={{
											fontSize: "0.65rem",
											fontWeight: 500,
											padding: "1px 5px",
											borderRadius: "4px",
											background:
												"color-mix(in srgb, currentColor 8%, transparent)",
											color: "color-mix(in srgb, currentColor 45%, transparent)",
											letterSpacing: "0.02em",
										}}
									>
										Soon
									</span>
								)}
								{isActive && available && (
									<CheckIcon />
								)}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
}

function ChevronIcon({ open }: { open: boolean }) {
	return (
		<svg
			width="10"
			height="10"
			viewBox="0 0 10 10"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			style={{
				transition: "transform 0.15s",
				transform: open ? "rotate(180deg)" : "rotate(0deg)",
				opacity: 0.5,
			}}
		>
			<path d="M2.5 3.5L5 6.5L7.5 3.5" />
		</svg>
	);
}

function CheckIcon() {
	return (
		<svg
			width="12"
			height="12"
			viewBox="0 0 12 12"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			style={{ opacity: 0.6 }}
		>
			<path d="M2.5 6.5L5 9L9.5 3.5" />
		</svg>
	);
}
