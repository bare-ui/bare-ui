export const iconNames = [
	'alert',
	'arrow-down',
	'arrow-left',
	'arrow-right',
	'attachment',
	'audio-file',
	'bullet-points',
	'call-end',
	'call-ingoing',
	'call',
	'caret-down',
	'chat-bubble',
	'chat-widget',
	'close-circle',
	'csv-file',
	'doc-file',
	'double-chevron-down',
	'edit',
	'emoji',
	'envelope',
	'export',
	'filter-funnel',
	'generic-file',
	'home',
	'menu',
	'message',
	'missed-chat',
	'mute',
	'pdf-file',
	'plus',
	'popout',
	'search',
	'searches',
	'send',
	'share-screen',
	'text-file',
	'thumbs-down',
	'thumbs-up',
	'user',
	'video-call-off',
	'video-call-on',
	'video-file',
	'volume-down',
	'volume-up',
	'warning-triangle',
	'x',
] as const

export type IconName = (typeof iconNames)[number]

export const iconSizes = ['xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge'] as const

export type IconSize = (typeof iconSizes)[number]

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
	/** The icon name that matches an SVG asset. */
	type: IconName
	/** A size modifier that increases or decreases the icon size. */
	size?: IconSize
	/** Accessible label for the icon. */
	label?: string
	/** Map of icon names to raw SVG strings. Must be provided by the consumer. */
	icons?: Partial<Record<IconName, string>>
}
