"use client";

import { useMemo, useState } from "react";
import data from "../data/bundle-sizes.json";
import s from "./bundle-size-table.module.css";

const FRAMEWORK_LABELS: Record<string, string> = {
	react: "React",
	solid: "Solid",
	vue: "Vue",
};

const frameworks = data.frameworks as string[];

function formatKb(bytes: number): string {
	return `${(bytes / 1000).toFixed(2)} kB`;
}

type SortKey = "name" | string;

export function BundleSizeTable() {
	// Default to the first framework's size, largest first — the components that
	// cost the most are the ones worth seeing at a glance.
	const [sortKey, setSortKey] = useState<SortKey>(frameworks[0]);
	const [asc, setAsc] = useState(false);

	const rows = useMemo(() => {
		const sorted = [...data.components];
		sorted.sort((a, b) => {
			let cmp: number;
			if (sortKey === "name") {
				cmp = a.name.localeCompare(b.name);
			} else {
				const av = (a.sizes as Record<string, number>)[sortKey] ?? 0;
				const bv = (b.sizes as Record<string, number>)[sortKey] ?? 0;
				cmp = av - bv;
			}
			return asc ? cmp : -cmp;
		});
		return sorted;
	}, [sortKey, asc]);

	function toggleSort(key: SortKey) {
		if (key === sortKey) {
			setAsc((v) => !v);
		} else {
			setSortKey(key);
			setAsc(key === "name");
		}
	}

	const arrow = (key: SortKey) =>
		key === sortKey ? (asc ? " ▲" : " ▼") : "";

	return (
		<div className={s.wrap}>
			<table className={s.table}>
				<thead>
					<tr>
						<th className={s.nameCol}>
							<button
								type="button"
								className={s.sortBtn}
								onClick={() => toggleSort("name")}
							>
								Component{arrow("name")}
							</button>
						</th>
						{frameworks.map((fw) => (
							<th key={fw} className={s.sizeCol}>
								<button
									type="button"
									className={s.sortBtn}
									onClick={() => toggleSort(fw)}
								>
									{FRAMEWORK_LABELS[fw] ?? fw}
									{arrow(fw)}
								</button>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr key={row.slug}>
							<td className={s.nameCell}>
								<a href={`/docs/components/${row.slug}`}>
									{row.name}
								</a>
							</td>
							{frameworks.map((fw) => (
								<td key={fw} className={s.sizeCell}>
									{formatKb(
										(row.sizes as Record<string, number>)[fw],
									)}
								</td>
							))}
						</tr>
					))}
				</tbody>
				<tfoot>
					<tr>
						<td className={s.nameCell}>
							Whole library <span className={s.muted}>(barrel)</span>
						</td>
						{frameworks.map((fw) => (
							<td key={fw} className={s.sizeCell}>
								{formatKb((data.barrel as Record<string, number>)[fw])}
							</td>
						))}
					</tr>
				</tfoot>
			</table>
		</div>
	);
}
