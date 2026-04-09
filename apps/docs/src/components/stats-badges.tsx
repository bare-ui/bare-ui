"use client";

import { useEffect, useState } from "react";

function formatNumber(n: number): string {
	if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
	return n.toString();
}

export function GitHubStars() {
	const [stars, setStars] = useState<number | null>(null);

	useEffect(() => {
		fetch("https://api.github.com/repos/wire-ui/wire-ui")
			.then((r) => r.json())
			.then((data) => {
				if (typeof data.stargazers_count === "number") {
					setStars(data.stargazers_count);
				}
			})
			.catch(() => {});
	}, []);

	if (stars === null) return null;

	return <span>{formatNumber(stars)}</span>;
}

export function NpmDownloads() {
	const [downloads, setDownloads] = useState<number | null>(null);

	useEffect(() => {
		fetch("https://api.npmjs.org/downloads/point/last-month/@wire-ui/react")
			.then((r) => r.json())
			.then((data) => {
				if (typeof data.downloads === "number") {
					setDownloads(data.downloads);
				}
			})
			.catch(() => {});
	}, []);

	if (downloads === null) return null;

	return <span>{formatNumber(downloads)}</span>;
}
