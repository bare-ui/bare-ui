import storybook from 'eslint-plugin-storybook'
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import { defineConfig, globalIgnores } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig([
	globalIgnores(['dist', 'storybook-static']),
	{
		files: ['**/*.ts'],
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
	{
		files: ['**/*.vue'],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			pluginVue.configs['flat/recommended'],
		],
		languageOptions: {
			parser: vueParser,
			parserOptions: {
				parser: tseslint.parser,
				ecmaVersion: 2020,
				sourceType: 'module',
				extraFileExtensions: ['.vue'],
			},
			globals: globals.browser,
		},
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
			],
			// Public component names are intentionally single-word (Button, Card, Badge, ...).
			'vue/multi-word-component-names': 'off',
			'vue/no-reserved-component-names': 'off',
			// Optional callback / controllable-state props legitimately default to undefined.
			'vue/require-default-prop': 'off',
			// `aria-label` props mirror the HTML attribute name for accessibility passthrough.
			'vue/prop-name-casing': 'off',
		},
	},
	...storybook.configs['flat/recommended'],
	eslintConfigPrettier,
])
