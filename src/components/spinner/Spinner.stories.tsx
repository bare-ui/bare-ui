import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spinner } from './Spinner'

const meta = {
	title: 'Components/Spinner',
	component: Spinner,
	tags: ['autodocs'],
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

// Spinner styles — uses 12 radial dots with staggered opacity animation
const spinnerStyle = `
  .bare-spinner {
    position: relative;
    display: inline-block;
  }
  .bare-spinner[data-size="small"] { width: 20px; height: 20px; }
  .bare-spinner[data-size="medium"] { width: 32px; height: 32px; }
  .bare-spinner[data-size="large"] { width: 48px; height: 48px; }

  .bare-spinner [data-part="dot"] {
    position: absolute;
    top: 0;
    left: 50%;
    width: 12%;
    height: 30%;
    border-radius: 999px;
    background-color: var(--spinner-color, currentColor);
    transform-origin: center 160%;
    animation: spinner-fade 1.2s linear infinite;
    opacity: 0;
  }
  .bare-spinner [data-part="dot"]:nth-child(1)  { transform: rotate(0deg);    animation-delay: -1.1s; }
  .bare-spinner [data-part="dot"]:nth-child(2)  { transform: rotate(30deg);   animation-delay: -1.0s; }
  .bare-spinner [data-part="dot"]:nth-child(3)  { transform: rotate(60deg);   animation-delay: -0.9s; }
  .bare-spinner [data-part="dot"]:nth-child(4)  { transform: rotate(90deg);   animation-delay: -0.8s; }
  .bare-spinner [data-part="dot"]:nth-child(5)  { transform: rotate(120deg);  animation-delay: -0.7s; }
  .bare-spinner [data-part="dot"]:nth-child(6)  { transform: rotate(150deg);  animation-delay: -0.6s; }
  .bare-spinner [data-part="dot"]:nth-child(7)  { transform: rotate(180deg);  animation-delay: -0.5s; }
  .bare-spinner [data-part="dot"]:nth-child(8)  { transform: rotate(210deg);  animation-delay: -0.4s; }
  .bare-spinner [data-part="dot"]:nth-child(9)  { transform: rotate(240deg);  animation-delay: -0.3s; }
  .bare-spinner [data-part="dot"]:nth-child(10) { transform: rotate(270deg);  animation-delay: -0.2s; }
  .bare-spinner [data-part="dot"]:nth-child(11) { transform: rotate(300deg);  animation-delay: -0.1s; }
  .bare-spinner [data-part="dot"]:nth-child(12) { transform: rotate(330deg);  animation-delay:  0.0s; }

  @keyframes spinner-fade {
    0%, 39%, 100% { opacity: 0.15; }
    40% { opacity: 1; }
  }
`

export const Default: Story = {
	render: () => (
		<>
			<style>{spinnerStyle}</style>
			<Spinner size="medium" className="bare-spinner text-gray-700" />
		</>
	),
}

export const Small: Story = {
	render: () => (
		<>
			<style>{spinnerStyle}</style>
			<Spinner size="small" className="bare-spinner text-gray-700" />
		</>
	),
}

export const Medium: Story = {
	render: () => (
		<>
			<style>{spinnerStyle}</style>
			<Spinner size="medium" className="bare-spinner text-gray-700" />
		</>
	),
}

export const Large: Story = {
	render: () => (
		<>
			<style>{spinnerStyle}</style>
			<Spinner size="large" className="bare-spinner text-gray-700" />
		</>
	),
}

export const CustomColor: Story = {
	render: () => (
		<>
			<style>{spinnerStyle}</style>
			<Spinner size="medium" color="#3b82f6" className="bare-spinner" />
		</>
	),
}

export const AllSizes: Story = {
	render: () => (
		<>
			<style>{spinnerStyle}</style>
			<div className="flex items-center gap-8">
				<div className="flex flex-col items-center gap-2">
					<Spinner size="small" className="bare-spinner text-gray-700" />
					<span className="text-xs text-gray-500">Small</span>
				</div>
				<div className="flex flex-col items-center gap-2">
					<Spinner size="medium" className="bare-spinner text-gray-700" />
					<span className="text-xs text-gray-500">Medium</span>
				</div>
				<div className="flex flex-col items-center gap-2">
					<Spinner size="large" className="bare-spinner text-gray-700" />
					<span className="text-xs text-gray-500">Large</span>
				</div>
			</div>
		</>
	),
}

export const Colors: Story = {
	render: () => (
		<>
			<style>{spinnerStyle}</style>
			<div className="flex items-center gap-8">
				<Spinner size="medium" color="#6b7280" className="bare-spinner" />
				<Spinner size="medium" color="#3b82f6" className="bare-spinner" />
				<Spinner size="medium" color="#10b981" className="bare-spinner" />
				<Spinner size="medium" color="#f59e0b" className="bare-spinner" />
				<Spinner size="medium" color="#ef4444" className="bare-spinner" />
				<Spinner size="medium" color="#8b5cf6" className="bare-spinner" />
			</div>
		</>
	),
}

export const LoadingButton: Story = {
	render: () => (
		<>
			<style>{spinnerStyle}</style>
			<button
				disabled
				className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white opacity-70"
			>
				<Spinner size="small" color="#fff" className="bare-spinner" />
				Loading…
			</button>
		</>
	),
}
