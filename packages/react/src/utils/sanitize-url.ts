/**
 * URL sanitization for attributes that the browser will navigate to or fetch
 * (`href`, `src`). Markdown/citation URLs ultimately come from parser output,
 * which may derive from untrusted user content — an attacker-controlled
 * `javascript:` or `data:text/html` URL is a classic XSS vector. The built-in
 * renderers run every URL through this so the default code paths are safe by
 * default; consumers who override the renderers own the sanitization for their
 * own markup.
 *
 * The check intentionally has no dependencies and mirrors the approach used by
 * React DOM, `marked`, and DOMPurify: strip the characters a browser ignores
 * when resolving a scheme, then reject a small deny-list of executable schemes.
 * Relative URLs, fragments (`#id`), query strings, and protocol-relative URLs
 * (`//host`) are always allowed — they cannot carry a dangerous scheme.
 */

// Characters a browser strips/ignores before resolving a URL's scheme. Leaving
// them in lets payloads like `java\tscript:` or ` javascript:` slip past a
// naive prefix check, so we remove them before testing the scheme: C0/C1
// control characters, ASCII space, and the zero-width/BOM code points browsers
// tolerate inside the scheme portion.
const STRIPPED_CHARS = /[\u0000-\u0020\u007F-\u009F\u200B-\u200D\u2028\u2029\uFEFF]/g;

// Schemes that can execute script or smuggle active content.
const DANGEROUS_SCHEME = /^(?:javascript|vbscript|data|file):/i;

// `data:` URLs that are safe for an <img>/media `src` (static raster images).
const SAFE_DATA_MEDIA = /^data:image\/(?:png|jpe?g|gif|webp|avif|bmp|x-icon|vnd\.microsoft\.icon)[;,]/i;

export interface SanitizeUrlOptions {
	/**
	 * Allow `data:` image URLs (e.g. `data:image/png;base64,…`) — appropriate
	 * for an `<img src>` but not for an `<a href>`. Scriptable image types such
	 * as `data:image/svg+xml` stay blocked.
	 */
	allowDataImages?: boolean;
}

/**
 * Returns the URL unchanged when its scheme is safe, or `undefined` when it
 * should be dropped. Callers spread the result into an attribute so a blocked
 * URL simply omits the attribute (e.g. an `<a>` with no `href`) rather than
 * rendering an active payload.
 */
export function sanitizeUrl(url: string | null | undefined, options: SanitizeUrlOptions = {}): string | undefined {
	if (url == null) return undefined;

	const trimmed = url.trim();
	if (trimmed === '') return undefined;

	// Collapse the characters a browser ignores so the scheme can't be obfuscated.
	const probe = trimmed.replace(STRIPPED_CHARS, '');

	if (DANGEROUS_SCHEME.test(probe)) {
		// Only a safe raster `data:image/*` URL is allowed back through, and only
		// when the caller opts in (image `src`, never a navigable `href`).
		if (options.allowDataImages && SAFE_DATA_MEDIA.test(probe)) {
			return url;
		}
		return undefined;
	}

	return url;
}
