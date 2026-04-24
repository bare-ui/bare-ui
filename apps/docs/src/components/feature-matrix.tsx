"use client";

import { FEATURE_MATRIX } from "../data/benchmarks";
import s from "./feature-matrix.module.css";

function CheckIcon() {
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
			aria-label="Yes"
		>
			<path d="M3 8l4 4 6-8" />
		</svg>
	);
}

function DashIcon() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			aria-label="No"
		>
			<path d="M4 8h8" />
		</svg>
	);
}

export function FeatureMatrix() {
	const { libraries, rows } = FEATURE_MATRIX;
	// Wire UI is always the first column
	const highlightIndex = 0;

	return (
		<div className={s.matrixWrap}>
			<table className={s.matrix}>
				<thead>
					<tr>
						<th className={s.featureCol}>Feature</th>
						{libraries.map((lib, i) => (
							<th
								key={lib}
								className={s.libCol}
								data-highlight={
									i === highlightIndex || undefined
								}
							>
								{lib}
								{i === highlightIndex && (
									<span className={s.star}>★</span>
								)}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr key={row.feature}>
							<td className={s.featureCell}>{row.feature}</td>
							{row.values.map((value, i) => (
								<td
									key={i}
									className={s.valueCell}
									data-highlight={
										i === highlightIndex || undefined
									}
								>
									{value === true ? (
										<span className={s.yes}>
											<CheckIcon />
										</span>
									) : value === false ? (
										<span className={s.no}>
											<DashIcon />
										</span>
									) : (
										<span className={s.custom}>
											{value}
										</span>
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
