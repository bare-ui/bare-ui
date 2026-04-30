import type { Preview } from '@storybook/react-vite';
import { createElement } from 'react';
import './tailwind.css';

const preview: Preview = {
	decorators: [
		(Story) =>
			createElement(
				'div',
				{
					style: {
						maxWidth: '1000px',
						width: '100%',
						margin: '0 auto',
						padding: '24px',
						fontFamily: "'Poppins', sans-serif",
						minHeight: '200px',
					},
				},
				createElement(Story),
			),
	],
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},

		a11y: {
			test: 'todo',
		},
	},
};

export default preview;
