/**
 * Shared benchmark harness.
 *
 * Some competitor libraries cannot render certain scenarios in the jsdom
 * benchmark environment — e.g. components that require a provider ancestor,
 * or that rely on browser layout APIs unavailable in jsdom. A single
 * incompatible competitor must not void the whole scenario's comparison.
 *
 * Each variant is smoke-tested before being benchmarked. Variants that throw
 * (or whose Vue error handler fires) are dropped from the run and reported
 * via `logSkips()` — they are never silently skipped.
 */
import { createApp, createSSRApp, type Component } from 'vue';
import { renderToString } from '@vue/server-renderer';
import type { Variant } from './scenarios';

const skipped: { scenario: string; lib: string; reason: string }[] = [];

/** Mount a component into a throwaway jsdom container and unmount it. */
export function mountOnce(Component: Component) {
	const container = document.createElement('div');
	document.body.appendChild(container);
	const app = createApp(Component);
	app.mount(container);
	app.unmount();
	container.remove();
}

/** Keep the variants that mount cleanly; record the rest. */
export function mountable(scenario: string, variants: Variant[]): Variant[] {
	return variants.filter((v) => {
		let error: string | null = null;
		const container = document.createElement('div');
		document.body.appendChild(container);
		const app = createApp(v.Component);
		// Vue catches render errors through errorHandler, not thrown exceptions.
		app.config.errorHandler = (err) => {
			error = (err as Error)?.message ?? String(err);
		};
		try {
			app.mount(container);
		} catch (err) {
			error = (err as Error)?.message ?? String(err);
		}
		app.unmount();
		container.remove();
		if (error) {
			skipped.push({ scenario, lib: v.lib, reason: error });
			return false;
		}
		return true;
	});
}

/** Keep the variants that server-render cleanly; record the rest. */
export async function ssrRenderable(scenario: string, variants: Variant[]): Promise<Variant[]> {
	const result: Variant[] = [];
	for (const v of variants) {
		try {
			await renderToString(createSSRApp(v.Component));
			result.push(v);
		} catch (err) {
			skipped.push({ scenario, lib: v.lib, reason: (err as Error)?.message ?? String(err) });
		}
	}
	return result;
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
