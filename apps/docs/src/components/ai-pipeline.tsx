"use client";

import { useEffect, useRef, useState } from "react";
import s from "./ai-pipeline.module.css";

const NODES = [
	{
		icon: "💬",
		label: "Prompt",
		desc: "Describe what you want to build",
	},
	{
		icon: "📡",
		label: "AI reads docs",
		desc: "llms.txt, MCP, and SKILL.md give AI full context",
	},
	{
		icon: "⌨️",
		label: "Generate",
		desc: "AI writes component code with correct API usage",
	},
	{
		icon: "🎨",
		label: "Customize",
		desc: "Style with data-* attributes — you own every pixel",
	},
	{
		icon: "🚀",
		label: "Ship",
		desc: "Production-ready in minutes, not hours",
	},
];

const LEFT_FEATURES = [
	{
		title: "MCP Server",
		desc: "First-class Model Context Protocol server for Claude, Cursor, and other AI assistants. Structured access to Wire UI's full API — accurate, versioned, and complete. No hallucinations, no outdated docs.",
	},
	{
		title: "AI-friendly exports",
		desc: "llms.txt, llms-full.txt, and SKILL.md — structured exports purpose-built for LLM consumption. Your AI tools get first-class data, not scraped HTML.",
	},
	{
		title: "Teach AI your conventions",
		desc: "SKILL.md lets you define your project's patterns and preferences. Generated code matches your team's style from the first prompt.",
	},
];

export function AIPipeline() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.15 },
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<section className={s.pipelineSection} ref={sectionRef}>
			<div className={s.pipelineGrid}>
				{/* Left column — vertical pipeline */}
				<div className={s.pipelineRight}>
					<div className={s.connectorWrap}>
						<div className={s.connectorBg} />
						<div
							className={s.connectorGlow}
							data-visible={isVisible}
						/>
					</div>

					<div className={s.nodes}>
						{NODES.map((node, i) => (
							<div
								key={node.label}
								className={s.node}
								data-visible={isVisible}
								style={
									{
										"--delay": `${i * 0.1}s`,
									} as React.CSSProperties
								}
							>
								<div className={s.nodeCard}>
									{node.icon}
									<span className={s.nodeStep}>{i + 1}</span>
								</div>
								<div className={s.nodeText}>
									<div className={s.nodeLabel}>
										{node.label}
									</div>
									<div className={s.nodeDesc}>
										{node.desc}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Left column — text + features + MCP link */}
				<div className={s.pipelineLeft}>
					<p className={s.pipelineSectionLabel}>
						AI-native ecosystem
					</p>
					<h2 className={s.pipelineSectionHeading}>
						Built for the AI era.
						<br />
						Not retrofitted.
					</h2>
					<p className={s.pipelineSectionSub}>
						Wire UI was designed from day one to be consumed by both
						humans and machines. Every component, every API surface,
						every doc page — structured for AI to read, understand,
						and generate production code from.
					</p>

					<div className={s.pipelineFeatures}>
						{LEFT_FEATURES.map((f) => (
							<div key={f.title} className={s.pipelineFeature}>
								<div>
									<div className={s.pipelineFeatureTitle}>
										{f.title}
									</div>
									<div className={s.pipelineFeatureDesc}>
										{f.desc}
									</div>
								</div>
							</div>
						))}
					</div>

					<a
						href="https://www.npmjs.com/package/@wire-ui/mcp"
						target="_blank"
						rel="noopener noreferrer"
						className={s.pipelineMcpLink}
					>
						<McpIcon /> @wire-ui/mcp
					</a>
				</div>
			</div>
		</section>
	);
}

function McpIcon({ size = 16 }: { size?: number }) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			<path d="M3.5 11.75L11.672 3.579a3 3 0 014.243 0 3 3 0 010 4.243M15.914 7.822L9.5 13.75M15.914 7.822a3 3 0 014.243 0 3 3 0 010 4.243L12.95 19.786a.5.5 0 000 .707L14.243 21.75" />
			<path d="M17.5 9.75l-6.172 6.171a3 3 0 01-4.243 0 3 3 0 010-4.243L13.5 5.75" />
		</svg>
	);
}
