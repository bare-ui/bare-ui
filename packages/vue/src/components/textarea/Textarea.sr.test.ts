import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h } from 'vue';
import { expectExposedAs } from '@/test/sr';
import { Textarea } from '.';

function renderTextarea(rootProps: Record<string, unknown> = {}) {
	return render({
		setup() {
			return () =>
				h(Textarea.Root, { ...rootProps }, () => [
					h(Textarea.Label, null, () => 'Message'),
					h(Textarea.Field, { placeholder: 'Enter message' }),
					h(Textarea.Error),
				]);
		},
	});
}

describe('Textarea — screen reader semantics', () => {
	it('is exposed as a textbox named by its label', () => {
		renderTextarea();
		const field = expectExposedAs('textbox', 'Message');
		expect(field).toBe(screen.getByPlaceholderText('Enter message'));
	});

	it('exposes the required state to assistive tech', () => {
		renderTextarea({ isRequired: true });
		// The required marker `*` is part of the label, so the announced name is "*Message".
		const field = expectExposedAs('textbox', '*Message');
		expect(field).toHaveAttribute('aria-required', 'true');
		expect(field).toBeRequired();
	});

	it('does not announce required when not required', () => {
		renderTextarea();
		expect(expectExposedAs('textbox', 'Message')).not.toHaveAttribute('aria-required');
	});

	it('marks the field invalid when errored', () => {
		renderTextarea({ invalidType: 'required', errorMessage: { required: 'Message is required' } });
		const field = expectExposedAs('textbox', 'Message');
		expect(field).toHaveAttribute('aria-invalid', 'true');
	});

	it('announces the error via an alert live region', () => {
		renderTextarea({ invalidType: 'required', errorMessage: { required: 'Message is required' } });
		expect(screen.getByRole('alert')).toHaveTextContent('Message is required');
	});

	it('is neither invalid nor described when there is no error', () => {
		renderTextarea();
		const field = expectExposedAs('textbox', 'Message');
		expect(field).not.toHaveAttribute('aria-invalid');
		expect(field).not.toHaveAttribute('aria-describedby');
	});
});
