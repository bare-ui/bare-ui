import { render } from '@testing-library/vue';
import { renderToString } from '@vue/server-renderer';
import { createSSRApp, defineComponent, h, nextTick, type Ref } from 'vue';
import { useIsMounted } from '@/composables/use-is-mounted';

/** Renders `mounted` as a data-state so both the client DOM and the SSR string are assertable. */
const Probe = defineComponent({
	setup() {
		const mounted = useIsMounted();
		return () => h('span', { 'data-state': mounted.value ? 'mounted' : 'pending' });
	},
});

describe('useIsMounted', () => {
	it('is false on the first render and flips to true after mount', async () => {
		const seen: boolean[] = [];
		const Capture = defineComponent({
			setup() {
				const mounted = useIsMounted();
				// Captured every render: the first (pre-mount) value must be false.
				seen.push(mounted.value);
				return () => h('span', { 'data-state': mounted.value ? 'mounted' : 'pending' });
			},
		});
		const { container } = render(Capture);
		expect(seen[0]).toBe(false);
		await nextTick();
		expect(container.querySelector('span')?.getAttribute('data-state')).toBe('mounted');
	});

	it('stays false through server render (onMounted never runs on the server)', async () => {
		// This is the SSR-critical contract: portals gate `<Teleport>` on this value
		// so server markup and the first client render agree (no hydration mismatch).
		const html = await renderToString(createSSRApp(Probe));
		expect(html).toContain('data-state="pending"');
		expect(html).not.toContain('data-state="mounted"');
	});

	it('returns a readonly ref that cannot be mutated by consumers', () => {
		let mounted!: Readonly<Ref<boolean>>;
		const Capture = defineComponent({
			setup() {
				mounted = useIsMounted();
				return () => h('div');
			},
		});
		render(Capture);
		expect(mounted.value).toBe(true);
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		// @ts-expect-error -- the ref is readonly; a write is a no-op (and dev-warns).
		mounted.value = false;
		expect(mounted.value).toBe(true);
		warn.mockRestore();
	});
});
