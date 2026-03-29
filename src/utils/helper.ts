import isEmpty from 'validator/es/lib/isEmpty';
import isEmail from 'validator/es/lib/isEmail';
import isLength from 'validator/es/lib/isLength';

export interface ValidationResult {
	isValid: boolean;
	message: string;
}

export interface ValidateOptions {
	value: string;
	type: 'email' | 'name' | 'phone';
}

export const Helper = {
	isValid({ value = '', type }: ValidateOptions): ValidationResult {
		if (type === 'email') {
			const isEmailValid = isEmail(value, {
				allow_display_name: false,
				require_display_name: false,
				allow_utf8_local_part: true,
				require_tld: true,
			});

			if (isEmailValid && value.length <= 150) {
				return { isValid: true, message: '' };
			} else {
				return { isValid: false, message: 'Invalid email address' };
			}
		} else if (type === 'name') {
			if (isLength(value, { min: 0, max: 40 })) {
				return { isValid: true, message: '' };
			} else {
				return { isValid: false, message: 'Must not be exceed in 40 characters' };
			}
		} else if (type === 'phone') {
			if (value.length === 0) {
				return { isValid: false, message: 'Invalid phone number length' };
			} else {
				return { isValid: true, message: '' };
			}
		} else {
			throw new Error('Invalid type');
		}
	},

	isEmpty(value = ''): boolean {
		return isEmpty(value);
	},

	generateUUID(): string {
		const alphabet = 'abcdefghijklmnopqrstuvwxyz';
		const randomCharacter = alphabet[Math.floor(Math.random() * alphabet.length)];
		const newDate = new Date().getTime();
		return `${randomCharacter}${Math.random().toString(32).substring(2)}${newDate}`;
	},
};
