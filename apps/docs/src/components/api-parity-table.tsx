"use client";

import data from "../data/api-parity.json";
import s from "./api-parity-table.module.css";

const FRAMEWORK_LABELS: Record<string, string> = {
	react: "React",
	solid: "Solid",
	vue: "Vue",
};

const frameworks = data.frameworks as string[];

function YesIcon() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-label="Available"
		>
			<path d="M3 8l4 4 6-8" />
		</svg>
	);
}

function NoCell() {
	return (
		<span className={s.no} aria-label="Not available">
			—
		</span>
	);
}

function HeaderRow() {
	return (
		<tr>
			<th className={s.nameCol}>Name</th>
			{frameworks.map((fw) => (
				<th key={fw} className={s.fwCol}>
					{FRAMEWORK_LABELS[fw] ?? fw}
				</th>
			))}
		</tr>
	);
}

export function ComponentParityTable() {
	const { components } = data;
	return (
		<div className={s.wrap}>
			<table className={s.table}>
				<thead>
					<HeaderRow />
				</thead>
				<tbody>
					{components.map((row) => (
						<tr key={row.name}>
							<td className={s.nameCell}>
								{row.doc ? (
									<a href={`/docs/components/${row.doc}`}>{row.name}</a>
								) : (
									row.name
								)}
							</td>
							{frameworks.map((fw) => (
								<td key={fw} className={s.fwCell}>
									{(row as Record<string, unknown>)[fw] ? (
										<span className={s.yes}>
											<YesIcon />
										</span>
									) : (
										<NoCell />
									)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export function HookParityTable() {
	const { hooks } = data;
	return (
		<div className={s.wrap}>
			<table className={s.table}>
				<thead>
					<HeaderRow />
				</thead>
				<tbody>
					{hooks.map((row) => (
						<tr key={row.concept}>
							<td className={s.nameCell}>
								{row.doc ? (
									<a href={`/docs/hooks/${row.doc}`}>{row.concept}</a>
								) : (
									row.concept
								)}
							</td>
							{frameworks.map((fw) => {
								const name = (row as Record<string, string | null>)[fw];
								return (
									<td key={fw} className={s.fwCell}>
										{name ? <code className={s.api}>{name}</code> : <NoCell />}
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
