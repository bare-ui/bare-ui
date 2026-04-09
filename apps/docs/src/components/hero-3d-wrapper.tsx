"use client";

import dynamic from "next/dynamic";

const Hero3D = dynamic(() => import("./hero-3d").then((m) => m.Hero3D), {
	ssr: false,
});

export function Hero3DWrapper({ className }: { className?: string }) {
	return (
		<div className={className} aria-hidden>
			<Hero3D />
		</div>
	);
}
