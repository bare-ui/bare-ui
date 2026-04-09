"use client";

import { useTextScramble } from "../hooks/use-text-scramble";

interface ScrambleTextProps {
	text: string;
	className?: string;
	delay?: number;
	speed?: number;
}

export function ScrambleText({
	text,
	className,
	delay = 0,
	speed = 30,
}: ScrambleTextProps) {
	const display = useTextScramble(text, { speed, delay });

	return (
		<span className={className} style={{ whiteSpace: "pre" }}>
			{display}
		</span>
	);
}
