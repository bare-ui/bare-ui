import type { Preview } from '@storybook/vue3-vite';
import { h } from 'vue';
import './tailwind.css';

const preview: Preview = {
	decorators: [
		(story) => ({
			setup() {
				return () =>
					h(
						'div',
						{
							style: {
								maxWidth: '1000px',
								width: '100%',
								margin: '0 auto',
								padding: '32px 24px',
								fontFamily: "'Poppins', sans-serif",
								minHeight: '200px',
							},
						},
						[h(story())],
					);
			},
		}),
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
