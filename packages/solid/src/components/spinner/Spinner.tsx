import { splitProps, type JSX } from 'solid-js';
import type { SpinnerProps } from './Spinner.types';

const visuallyHidden: JSX.CSSProperties = {
	position: 'absolute',
	width: '1px',
	height: '1px',
	padding: 0,
	margin: '-1px',
	overflow: 'hidden',
	clip: 'rect(0,0,0,0)',
	'white-space': 'nowrap',
	'border-width': 0,
};

function Spinner(props: SpinnerProps) {
	const [local, rest] = splitProps(props, ['label', 'decorative', 'class', 'children']);
	const label = () => local.label ?? 'Loading';
	const decorative = () => local.decorative ?? true;

	return (
		<span
			role='status'
			aria-live='polite'
			aria-label={label()}
			class={local.class}
			{...rest}>
			<span aria-hidden={decorative() ? 'true' : undefined}>{local.children}</span>
			<span style={visuallyHidden}>{label()}</span>
		</span>
	);
}

export { Spinner };
