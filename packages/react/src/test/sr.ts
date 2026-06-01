/**
 * Screen-reader semantics test helpers.
 *
 * These assertions approximate what VoiceOver (Safari), NVDA (Firefox/Chrome)
 * and JAWS actually announce — the layer of accessibility that axe-core's static
 * audit cannot verify. axe checks that the markup is *valid*; these helpers check
 * that the markup *says the right thing*:
 *
 *   - the computed accessible **name** a screen reader reads for a control,
 *   - the **role** it is exposed as,
 *   - ARIA **state** (expanded / selected / checked / pressed / current / disabled)
 *     and that it transitions on interaction,
 *   - exposed **relationships** (labelledby / describedby / controls / activedescendant),
 *   - **live-region** announcements when content changes dynamically.
 *
 * They run in the fast jsdom `unit` project and are NOT a substitute for the
 * manual VoiceOver / NVDA / JAWS smoke pass — they make that pass repeatable and
 * catch regressions in the semantics the real screen readers depend on.
 */
import { expect } from 'vitest';
import { within, type ByRoleMatcher, type ByRoleOptions } from '@testing-library/react';

/**
 * Assert that exactly one element is exposed to assistive tech with the given
 * role and accessible name, and return it. This is the canonical screen-reader
 * query: SR users navigate by role ("next button", "next heading") and identify
 * controls by their accessible name. Throws if zero or many match.
 */
export function expectExposedAs(
	role: ByRoleMatcher,
	name: string | RegExp,
	options: Omit<ByRoleOptions, 'name'> = {},
	container: HTMLElement = document.body,
): HTMLElement {
	return within(container).getByRole(role, { name, ...options });
}

/**
 * Collect the text a screen reader would announce from live regions in the
 * subtree: elements with role="status", role="alert", role="log", or an explicit
 * aria-live. Elements with aria-live="off" are excluded.
 */
export function liveRegionText(container: HTMLElement = document.body): string {
	const regions = container.querySelectorAll<HTMLElement>(
		'[role="status"], [role="alert"], [role="log"], [aria-live]',
	);
	return Array.from(regions)
		.filter((el) => el.getAttribute('aria-live') !== 'off')
		.map((el) => el.textContent?.trim() ?? '')
		.filter(Boolean)
		.join(' ');
}

/**
 * Assert that a live region in the subtree would announce the given text. Use
 * for toasts, alerts, status messages, async result counts, etc. — anything a
 * sighted user sees appear that a screen reader must be told about.
 */
export function expectAnnounced(text: string | RegExp, container: HTMLElement = document.body): void {
	const announced = liveRegionText(container);
	if (typeof text === 'string') {
		expect(announced).toContain(text);
	} else {
		expect(announced).toMatch(text);
	}
}

/**
 * Resolve an element to the accessible name a screen reader would read, following
 * aria-labelledby. Useful when asserting a region/panel inherits its name from a
 * related control (e.g. a tabpanel named by its tab, a section by its heading).
 */
export function accessibleNameVia(el: HTMLElement): string {
	const labelledby = el.getAttribute('aria-labelledby');
	if (labelledby) {
		return labelledby
			.split(/\s+/)
			.map((id) => el.ownerDocument.getElementById(id)?.textContent?.trim() ?? '')
			.filter(Boolean)
			.join(' ');
	}
	return el.getAttribute('aria-label') ?? el.textContent?.trim() ?? '';
}
