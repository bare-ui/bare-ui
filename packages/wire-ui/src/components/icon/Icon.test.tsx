import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Icon } from './Icon';

const testIcons = {
	home: '<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
	star: '<svg viewBox="0 0 20 20"><path d="M10 1l2.4 7.3H20l-6.2 4.5 2.4 7.3L10 15.6l-6.2 4.5 2.4-7.3L0 8.3h7.6z"/></svg>',
};

describe('Icon', () => {
	it('renders an SVG element', () => {
		render(
			<Icon
				type='home'
				icons={testIcons}
			/>,
		);
		expect(document.querySelector('svg')).toBeInTheDocument();
	});

	it('returns null when type is not in icons map', () => {
		const { container } = render(
			<Icon
				type={'missing' as never}
				icons={testIcons}
			/>,
		);
		expect(container.firstChild).toBeNull();
	});

	it('sets correct viewBox from SVG source', () => {
		render(
			<Icon
				type='home'
				icons={testIcons}
			/>,
		);
		expect(document.querySelector('svg')).toHaveAttribute('viewBox', '0 0 24 24');
	});

	it('sets data-name to the type', () => {
		render(
			<Icon
				type='home'
				icons={testIcons}
			/>,
		);
		expect(document.querySelector('svg')).toHaveAttribute('data-name', 'home');
	});

	it('sets data-size when size prop is provided', () => {
		render(
			<Icon
				type='home'
				icons={testIcons}
				size='large'
			/>,
		);
		expect(document.querySelector('svg')).toHaveAttribute('data-size', 'large');
	});

	it('is decorative (aria-hidden) when no label is provided', () => {
		render(
			<Icon
				type='home'
				icons={testIcons}
			/>,
		);
		expect(document.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
	});

	it('is accessible with aria-label when label is provided', () => {
		render(
			<Icon
				type='home'
				icons={testIcons}
				label='Home'
			/>,
		);
		const svg = document.querySelector('svg')!;
		expect(svg).toHaveAttribute('aria-label', 'Home');
		expect(svg).not.toHaveAttribute('aria-hidden');
	});

	it('applies className', () => {
		render(
			<Icon
				type='home'
				icons={testIcons}
				className='my-icon'
			/>,
		);
		expect(document.querySelector('svg')).toHaveClass('my-icon');
	});
});
