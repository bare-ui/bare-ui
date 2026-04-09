import { useState, useEffect, useRef } from "react";

const CHARS =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

function randomChar() {
	return CHARS[Math.floor(Math.random() * CHARS.length)];
}

interface UseTextScrambleOptions {
	speed?: number;
	delay?: number;
}

export function useTextScramble(
	text: string,
	{ speed = 30, delay = 0 }: UseTextScrambleOptions = {},
): string {
	const [display, setDisplay] = useState("");
	const resolvedIndex = useRef(-1);
	const frameRef = useRef<number>(0);
	const lastTickRef = useRef(0);
	const startedRef = useRef(false);
	const startTimeRef = useRef(0);

	useEffect(() => {
		resolvedIndex.current = -1;
		startedRef.current = false;
		startTimeRef.current = performance.now();

		const scramble = () => {
			setDisplay(
				text
					.split("")
					.map((char, i) => {
						if (char === " ") return " ";
						if (i <= resolvedIndex.current) return char;
						return randomChar();
					})
					.join(""),
			);
		};

		const tick = (now: number) => {
			if (!startedRef.current) {
				if (now - startTimeRef.current < delay) {
					scramble();
					frameRef.current = requestAnimationFrame(tick);
					return;
				}
				startedRef.current = true;
				lastTickRef.current = now;
			}

			if (now - lastTickRef.current >= speed) {
				lastTickRef.current = now;
				resolvedIndex.current++;
				if (resolvedIndex.current >= text.length) {
					setDisplay(text);
					return;
				}
			}

			scramble();
			frameRef.current = requestAnimationFrame(tick);
		};

		frameRef.current = requestAnimationFrame(tick);

		return () => cancelAnimationFrame(frameRef.current);
	}, [text, speed, delay]);

	return display;
}
