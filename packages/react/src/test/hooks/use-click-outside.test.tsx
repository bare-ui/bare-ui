import { render } from '@testing-library/react';
import { useRef } from 'react';
import { useClickOutside } from '@/hooks/use-click-outside';

function Harness({
	callback,
	includeInside = true,
}: {
	callback: (e: MouseEvent | TouchEvent) => void;
	includeInside?: boolean;
}) {
	const ref = useRef<HTMLDivElement | null>(null);
	useClickOutside(ref, callback);
	return (
		<div>
			<div
				ref={ref}
				data-testid='inside-container'
			>
				{includeInside ? <span data-testid='inside-child'>inside</span> : null}
			</div>
			<button data-testid='outside'>outside</button>
		</div>
	);
}

describe('useClickOutside', () => {
	it('calls callback when clicking outside the element', () => {
		const cb = vi.fn();
		const { getByTestId } = render(<Harness callback={cb} />);
		getByTestId('outside').dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(cb).toHaveBeenCalledTimes(1);
	});

	it('does not call callback when clicking inside the element', () => {
		const cb = vi.fn();
		const { getByTestId } = render(<Harness callback={cb} />);
		getByTestId('inside-container').dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(cb).not.toHaveBeenCalled();
	});

	it('does not fire for clicks on descendants of the target', () => {
		const cb = vi.fn();
		const { getByTestId } = render(<Harness callback={cb} />);
		getByTestId('inside-child').dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(cb).not.toHaveBeenCalled();
	});

	it('fires on touchstart events from outside the element', () => {
		const cb = vi.fn();
		const { getByTestId } = render(<Harness callback={cb} />);
		getByTestId('outside').dispatchEvent(new Event('touchstart', { bubbles: true }));
		expect(cb).toHaveBeenCalledTimes(1);
	});

	it('does not fire on touchstart events inside the element', () => {
		const cb = vi.fn();
		const { getByTestId } = render(<Harness callback={cb} />);
		getByTestId('inside-child').dispatchEvent(new Event('touchstart', { bubbles: true }));
		expect(cb).not.toHaveBeenCalled();
	});

	it('passes the event to the callback', () => {
		const cb = vi.fn();
		const { getByTestId } = render(<Harness callback={cb} />);
		const evt = new MouseEvent('click', { bubbles: true });
		getByTestId('outside').dispatchEvent(evt);
		expect(cb).toHaveBeenCalledWith(evt);
	});

	it('does not fire when ref is null (no element to be outside of)', () => {
		const cb = vi.fn();
		function NullRef() {
			const ref = useRef<HTMLDivElement | null>(null);
			useClickOutside(ref, cb);
			return <button data-testid='outside'>x</button>;
		}
		const { getByTestId } = render(<NullRef />);
		getByTestId('outside').dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(cb).not.toHaveBeenCalled();
	});

	it('removes the listener on unmount', () => {
		const cb = vi.fn();
		const { unmount } = render(<Harness callback={cb} />);
		unmount();
		document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(cb).not.toHaveBeenCalled();
	});
});
