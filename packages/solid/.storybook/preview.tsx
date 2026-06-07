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
					'min-height': '200px',
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

		// Fail the Vitest browser run (and CI) on any axe-core violation.
		a11y: {
			test: 'error',
			config: {
				rules: [
					// Wire UI ships zero CSS — components impose no colors, so
					// contrast is entirely the consumer's responsibility. The
					// colors in our stories are illustrative demo styling, not a
					// component guarantee. We assert semantics/ARIA/focus/keyboard
					// here and document contrast as consumer-owned in the WCAG
					// statement. (Consumers should run axe against their own themed
					// app to catch contrast in their color choices.)
					{ id: 'color-contrast', enabled: false },
				],
			},
		},
	},
};

export default preview;
