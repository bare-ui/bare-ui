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
						padding: '32px 24px',
						border: '1px dashed #e0e0e0',
						fontFamily: "'Patrick Hand', cursive",
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
