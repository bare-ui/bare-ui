import { splitProps } from 'solid-js';
import type { ProgressBarProps } from './ProgressBar.types';

function ProgressBar(props: ProgressBarProps) {
	const [local, rest] = splitProps(props, ['percentage', 'size', 'class']);
	const clamped = () => Math.min(100, Math.max(0, local.percentage ?? 0));
	const sizeProp = () => local.size ?? 'medium';

	return (
		<div
			class={local.class}
			role='progressbar'
			aria-valuenow={clamped()}
			aria-valuemin={0}
			aria-valuemax={100}
			data-size={sizeProp()}
			{...rest}>
			<div
				data-part='fill'
				style={{ width: `${clamped()}%` }}
			/>
		</div>
	);
}

export { ProgressBar };
