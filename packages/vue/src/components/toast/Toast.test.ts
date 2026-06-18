import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { defineComponent, nextTick } from 'vue';
import { Toast, useToast } from '.';

const {
	Provider: ToastProvider,
	Viewport: ToastViewport,
	Root: ToastRoot,
	Title: ToastTitle,
	Description: ToastDescription,
	Close: ToastClose,
} = Toast;

// useToast() must be called inside a component descended from ToastProvider.
const Harness = defineComponent({
	name: 'ToastHarness',
	components: { ToastViewport, ToastRoot, ToastTitle, ToastDescription, ToastClose },
	props: { duration: { type: Number, required: false, default: undefined } },
	setup(props) {
		const { toast } = useToast();
		function show() {
			toast({ id: 'hello', title: 'Hello', description: 'World', duration: props.duration });
		}
		function persistent() {
			toast({ title: 'Persistent', duration: 0 });
		}
		return { show, persistent };
	},
	template: `
		<div>
			<button @click="show">show</button>
			<button @click="persistent">persistent</button>
			<ToastViewport v-slot="{ toast, dismiss }">
				<ToastRoot :key="toast.id">
					<ToastTitle>{{ toast.title }}</ToastTitle>
					<ToastDescription>{{ toast.description }}</ToastDescription>
					<ToastClose @click="dismiss">×</ToastClose>
				</ToastRoot>
			</ToastViewport>
		</div>
	`,
});

function renderApp(props: { duration?: number; defaultDuration?: number } = {}) {
	return render({
		components: { ToastProvider, Harness },
		setup() {
			return { defaultDuration: props.defaultDuration ?? 100, duration: props.duration };
		},
		template: `
			<ToastProvider :default-duration="defaultDuration">
				<Harness :duration="duration" />
			</ToastProvider>
		`,
	});
}

describe('Toast', () => {
	it('shows a toast when triggered', async () => {
		renderApp({ duration: 0 }); // persistent — keep it visible during the test
		await userEvent.click(screen.getByText('show'));
		expect(screen.getByText('Hello')).toBeInTheDocument();
		expect(screen.getByText('World')).toBeInTheDocument();
	});

	it('auto-dismisses after the specified duration', async () => {
		renderApp({ defaultDuration: 50 });
		await userEvent.click(screen.getByText('show'));
		expect(screen.getByText('Hello')).toBeInTheDocument();
		await waitFor(() => expect(screen.queryByText('Hello')).not.toBeInTheDocument(), { timeout: 1000 });
	});

	it('duration=0 stays mounted', async () => {
		renderApp({ defaultDuration: 50 });
		await userEvent.click(screen.getByText('persistent'));
		// Wait long enough that a non-persistent toast would have dismissed.
		await new Promise((r) => setTimeout(r, 200));
		expect(screen.getByText('Persistent')).toBeInTheDocument();
	});

	it('Close dismisses the toast', async () => {
		renderApp({ duration: 0 });
		await userEvent.click(screen.getByText('show'));
		expect(screen.getByText('Hello')).toBeInTheDocument();
		await userEvent.click(screen.getByRole('button', { name: 'Close notification' }));
		await nextTick();
		expect(screen.queryByText('Hello')).not.toBeInTheDocument();
	});

	it('throws when useToast is called outside Provider', () => {
		const Bad = defineComponent({
			setup() {
				useToast();
				return () => null;
			},
		});
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() => render(Bad)).toThrow();
		spy.mockRestore();
	});
});
