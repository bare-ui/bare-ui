/** @type {import('prettier').Config} */
const config = {
	/**
	 * Try prettier's new ternary formatting before it becomes the default behavior.
	 *
	 * @see {@link https://prettier.io/docs/options#experimental-ternaries}
	 */
	experimentalTernaries: true,

	/**
	 * Specify the line length that the printer will wrap on.
	 *
	 * @see {@link https://prettier.io/docs/options#print-width}
	 */
	printWidth: 120,

	/**
	 * Specify the number of spaces per indentation level.
	 *
	 * @see {@link https://prettier.io/docs/options#tab-width}
	 */
	tabWidth: 4,

	/**
	 * Indent lines with tabs instead of spaces.
	 *
	 * @see {@link https://prettier.io/docs/options#use-tabs}
	 */
	useTabs: true,

	/**
	 * Print semicolons at the ends of statements.
	 *
	 * @see {@link https://prettier.io/docs/options#semi}
	 */
	semi: true,

	/**
	 * Print single quotes instead of double quotes.
	 *
	 * @see {@link https://prettier.io/docs/options#single-quote}
	 */
	singleQuote: true,

	/**
	 * Use property name quotes as needed.
	 *
	 * @see {@link https://prettier.io/docs/options#quote-props}
	 */
	quoteProps: 'preserve',

	/**
	 * Use single quotes for JSX.
	 *
	 * @see {@link https://prettier.io/docs/options#jsx-single-quote}
	 */
	jsxSingleQuote: true,

	/**
	 * Print trailing commas wherever possible.
	 *
	 * @see {@link https://prettier.io/docs/options#trailing-commas}
	 */
	trailingComma: 'all',

	/**
	 * Print spaces between brackets in object literals.
	 *
	 * @see {@link https://prettier.io/docs/options#bracket-spacing}
	 */
	bracketSpacing: true,

	/**
	 * Preserve the wrapping mode of objects.
	 *
	 * @see {@link https://prettier.io/docs/options#object-wrap-mode}
	 */
	objectWrap: 'preserve',

	/**
	 * Print brackets on the same line as the corresponding control flow statement.
	 *
	 * @see {@link https://prettier.io/docs/options#bracket-same-line}
	 */
	bracketSameLine: true,

	/**
	 * Print parentheses around arrow function arguments.
	 *
	 * @see {@link https://prettier.io/docs/options#arrow-parens}
	 */
	arrowParens: 'always',

	/**
	 * By default, Prettier will not change wrapping in markdown text since some services use a linebreak-sensitive
	 * renderer, e.g. GitHub comments and BitBucket. To have Prettier wrap prose to the print width, change this option
	 * to "always". If you want Prettier to force all prose blocks to be on a single line and rely on editor/viewer
	 * soft wrapping instead, you can use "never".
	 *
	 * @see {@link https://prettier.io/docs/options#prose-wrap}
	 */
	proseWrap: 'always',

	/**
	 * How to handle whitespace in HTML files.
	 *
	 * @see {@link https://prettier.io/docs/options#html-whitespace-sensitivity}
	 */
	htmlWhitespaceSensitivity: 'strict',

	/**
	 * Whether to indent the script and style tags in Vue files.
	 */
	vueIndentScriptAndStyle: false,

	/**
	 * The end of line character to use.
	 *
	 * @see {@link https://prettier.io/docs/options#end-of-line}
	 */
	endOfLine: 'lf',

	/**
	 * How to format embedded language fragments.
	 *
	 * @see {@link https://prettier.io/docs/options#embedded-language-formatting}
	 */
	embeddedLanguageFormatting: 'auto',

	/**
	 * Whether to put each attribute on a new line in HTML and Vue files.
	 *
	 * @see {@link https://prettier.io/docs/options#single-attribute-per-line}
	 */
	singleAttributePerLine: true,
};

export default config;
