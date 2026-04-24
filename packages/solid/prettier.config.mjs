/** @type {import('prettier').Config} */
const config = {
	experimentalTernaries: true,
	printWidth: 120,
	tabWidth: 4,
	useTabs: true,
	semi: true,
	singleQuote: true,
	quoteProps: 'preserve',
	trailingComma: 'all',
	bracketSpacing: true,
	objectWrap: 'preserve',
	bracketSameLine: true,
	arrowParens: 'always',
	proseWrap: 'always',
	htmlWhitespaceSensitivity: 'strict',
	endOfLine: 'lf',
	embeddedLanguageFormatting: 'auto',
	singleAttributePerLine: true,
};

export default config;
