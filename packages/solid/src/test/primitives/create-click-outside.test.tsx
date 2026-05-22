import { render } from '@solidjs/testing-library';
import { createClickOutside } from '@/primitives/create-click-outside';

function Harness(props: { callback: (e: MouseEvent | TouchEvent) => void; includeInside?: boolean }) {
	let inner: HTMLDivElement | undefined;
	createClickOutside(
		() => inner,
		(event) => props.callback(event),
	);
	return (
		<div>
			<div
				ref={inner}
				data-testid='inside-container'
			>
				{props.includeInside !== false ? <span data-testid='inside-child'>inside</span> : null}
			</div>
			<button data-testid='outside'>outside</button>
		</div>
	);
}

describe('createClickOutside', () => {
	it('fires callback on click outside', () => {
		const cb = vi.fn();
		const { getByTestId } = render(() => <Harness callback={cb} />);
		getByTestId('outside').dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(cb).toHaveBeenCalledTimes(1);
	});

	it('does not fire on click inside', () => {
		const cb = vi.fn();
		const { getByTestId } = render(() => <Harness callback={cb} />);
		getByTestId('inside-container').dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(cb).not.toHaveBeenCalled();
	});

	it('does not fire on click on a descendant', () => {
		const cb = vi.fn();
		const { getByTestId } = render(() => <Harness callback={cb} />);
		getByTestId('inside-child').dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(cb).not.toHaveBeenCalled();
	});

	it('fires on touchstart outside', () => {
		const cb = vi.fn();
		const { getByTestId } = render(() => <Harness callback={cb} />);
		getByTestId('outside').dispatchEvent(new Event('touchstart', { bubbles: true }));
		expect(cb).toHaveBeenCalledTimes(1);
	});

	it('passes the event to the callback', () => {
		const cb = vi.fn();
		const { getByTestId } = render(() => <Harness callback={cb} />);
		const evt = new MouseEvent('click', { bubbles: true });
		getByTestId('outside').dispatchEvent(evt);
		expect(cb).toHaveBeenCalledWith(evt);
	});

	it('removes the listener on cleanup', () => {
		const cb = vi.fn();
		const { unmount } = render(() => <Harness callback={cb} />);
		unmount();
		document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(cb).not.toHaveBeenCalled();
	});
});
