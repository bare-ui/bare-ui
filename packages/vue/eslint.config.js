import storybook from 'eslint-plugin-storybook'
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig([
	globalIgnores(['dist', 'storybook-static']),
	{
		files: ['**/*.{ts,vue}'],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
			],
		},
	},
	...storybook.configs['flat/recommended'],
	eslintConfigPrettier,
])
