/**
 * Screen-reader semantics for Toast. Toasts appear without focus moving, so a
 * screen reader only learns about them through a live region. Verifies the
 * viewport is a named region and each toast announces politely via role=status.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { defineComponent, nextTick } from 'vue';
import { expectExposedAs, expectAnnounced } from '@/test/sr';
import { Toast, useToast } from '.';

const {
	Provider: ToastProvider,
	Viewport: ToastViewport,
	Root: ToastRoot,
	Title: ToastTitle,
	Description: ToastDescription,
	Close: ToastClose,
} = Toast;

// useToast() must be called inside a component that is a descendant of ToastProvider.
const Harness = defineComponent({
	name: 'ToastHarness',
	components: { ToastViewport, ToastRoot, ToastTitle, ToastDescription, ToastClose },
	setup() {
		const { toast } = useToast();
		function showToast() {
			toast({ id: 'saved', title: 'Saved', description: 'Your changes were saved', duration: 0 });
		}
		return { showToast };
	},
	template: `
		<div>
			<button @click="showToast">show</button>
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

function renderApp() {
	return render({
		template: `<ToastProvider><Harness /></ToastProvider>`,
		components: { ToastProvider, Harness },
	});
}

describe('Toast — screen reader semantics', () => {
	it('exposes the viewport as a named region', () => {
		renderApp();
		expectExposedAs('region', 'Notifications');
	});

	it('announces a new toast politely through a live region', async () => {
		renderApp();
		await userEvent.click(screen.getByText('show'));
		await nextTick();
		// role=status implies aria-live=polite — the toast text reaches the SR.
		const status = screen.getByRole('status');
		expect(status).toHaveAttribute('aria-live', 'polite');
		expectAnnounced('Saved');
		expectAnnounced('Your changes were saved');
	});

	it('gives the dismiss control an accessible name', async () => {
		renderApp();
		await userEvent.click(screen.getByText('show'));
		await nextTick();
		expectExposedAs('button', 'Close notification');
	});
});
