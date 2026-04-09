"use client";

import { useEffect, useRef } from "react";

const CHARS = [
	"·",
	"[",
	"]",
	"{",
	"}",
	"\\",
	"/",
	"?",
	"|",
	"<",
	">",
	";",
	"·",
	"·",
	"·",
];
const CELL_SIZE = 32;
const FONT_SIZE = 11;

export function CharGridBg({ className }: { className?: string }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const draw = () => {
			const dpr = window.devicePixelRatio || 1;
			const w = window.innerWidth;
			// Match the parent container height (which is set by CSS bottom:0)
			const parent = canvas.parentElement;
			const h = parent ? parent.offsetHeight : document.documentElement.scrollHeight;

			canvas.width = w * dpr;
			canvas.height = h * dpr;
			canvas.style.width = `${w}px`;
			canvas.style.height = `${h}px`;

			const ctx = canvas.getContext("2d")!;
			ctx.scale(dpr, dpr);
			ctx.clearRect(0, 0, w, h);

			// Detect dark mode
			const isDark =
				document.documentElement.classList.contains("dark") ||
				(!document.documentElement.classList.contains("light") &&
					window.matchMedia("(prefers-color-scheme: dark)").matches);

			ctx.fillStyle = isDark ? "#ffffff" : "#000000";
			ctx.font = `${FONT_SIZE}px "SF Mono", "Fira Code", "Courier New", monospace`;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";

			const cols = Math.ceil(w / CELL_SIZE) + 1;
			const rows = Math.ceil(h / CELL_SIZE) + 1;

			// Seeded random for stable pattern
			let seed = 42;
			const rand = () => {
				seed = (seed * 16807 + 0) % 2147483647;
				return seed / 2147483647;
			};

			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < cols; col++) {
					const x = col * CELL_SIZE + CELL_SIZE / 2;
					const y = row * CELL_SIZE + CELL_SIZE / 2;
					const char = CHARS[Math.floor(rand() * CHARS.length)];
					ctx.fillText(char, x, y);
				}
			}
		};

		// Draw after layout settles
		requestAnimationFrame(() => {
			requestAnimationFrame(draw);
		});

		// Redraw on resize
		window.addEventListener("resize", draw);

		// Redraw when theme changes (class mutations on <html>)
		const observer = new MutationObserver(draw);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});

		// Redraw when system color scheme changes
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		mq.addEventListener("change", draw);

		return () => {
			window.removeEventListener("resize", draw);
			observer.disconnect();
			mq.removeEventListener("change", draw);
		};
	}, []);

	return <canvas ref={canvasRef} className={className} />;
}
