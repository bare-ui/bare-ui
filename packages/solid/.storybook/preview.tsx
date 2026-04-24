import type { Preview } from 'storybook-solidjs-vite';
import './tailwind.css';

const preview: Preview = {
	decorators: [
		(Story) => (
			<div
				style={{
					'max-width': '1000px',
					width: '100%',
					margin: '0 auto',
					padding: '32px 24px',
					'font-family': "'Poppins', sans-serif",
					'min-height': '100vh',
				}}>
				<Story />
			</div>
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
