/**
 * Shared benchmark harness.
 *
 * Some competitor libraries cannot render certain scenarios in the jsdom
 * benchmark environment — e.g. corvu's precompiled overlay primitives hit a
 * circular-import temporal-dead-zone when re-processed by the Solid transform,
 * and Kobalte's Accordion recurses without real layout. Those are properties of
 * the *harness*, not of the library, and a single incompatible competitor must
 * not void the whole scenario's comparison.
 *
 * So each variant is smoke-tested once before being benchmarked. Variants that
 * throw are dropped from the run and reported via `logSkips()` — they are never
 * silently skipped.
 */
import { render, renderToString } from 'solid-js/web';
import type { JSX } from 'solid-js';
import type { Variant } from './scenarios';

const skipped: { scenario: string; lib: string; reason: string }[] = [];

/** Mount a component into a throwaway jsdom container and dispose it. */
export function mountOnce(Component: () => JSX.Element) {
	const container = document.createElement('div');
	document.body.appendChild(container);
	const dispose = render(() => <Component />, container);
	dispose();
	container.remove();
}

function survives(run: () => void): true | string {
	try {
		run();
		return true;
	} catch (err) {
		return (err as Error).message || String(err);
	}
}

/** Keep the variants that mount cleanly; record the rest. */
export function mountable(scenario: string, variants: Variant[]): Variant[] {
	return variants.filter((v) => {
		const result = survives(() => mountOnce(v.Component));
		if (result === true) return true;
		skipped.push({ scenario, lib: v.lib, reason: result });
		return false;
	});
}

/** Keep the variants that server-render cleanly; record the rest. */
export function ssrRenderable(scenario: string, variants: Variant[]): Variant[] {
	return variants.filter((v) => {
		const result = survives(() => renderToString(() => <v.Component />));
		if (result === true) return true;
		skipped.push({ scenario, lib: v.lib, reason: result });
		return false;
	});
}

/** Print a one-line summary of every variant dropped from the run. */
export function logSkips(suite: string) {
	if (skipped.length === 0) return;
	console.warn(
		`\n[bench:${suite}] skipped ${skipped.length} variant(s) — do not render in this jsdom harness:`,
	);
	for (const s of skipped) {
		console.warn(`  · ${s.scenario}/${s.lib}: ${s.reason}`);
	}
}
