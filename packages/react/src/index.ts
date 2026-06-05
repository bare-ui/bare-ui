// Components
export {
	Accordion,
	Alert,
	AspectRatio,
	Avatar,
	Badge,
	Breadcrumb,
	Button,
	Calendar,
	Card,
	Carousel,
	Chat,
	Citation,
	CodeBlock,
	ColorPicker,
	Command,
	Divider,
	Checkbox,
	Combobox,
	ContextMenu,
	DatePicker,
	Diff,
	Drawer,
	Dropdown,
	Editable,
	EmptyState,
	FileUpload,
	Form,
	HoverCard,
	Icon,
	Image,
	InfiniteScroll,
	Input,
	List,
	Markdown,
	Mention,
	MenuBar,
	Modal,
	NavigationMenu,
	NumberInput,
	OTP,
	Pagination,
	Password,
	Popover,
	ProgressBar,
	Radio,
	Rating,
	ResizablePanels,
	RichText,
	ScrollArea,
	Search,
	Select,
	Sheet,
	Skeleton,
	Slider,
	Spinner,
	Stat,
	Stepper,
	Switch,
	Tabs,
	Tag,
	TagInput,
	Textarea,
	Timeago,
	Toast,
	useToast,
	Toggle,
	ToggleGroup,
	Toolbar,
	Tooltip,
	TreeView,
	Typewriter,
	Virtualizer,
} from './components';

// Hooks
export {
	useClickOutside,
	useInteractiveState,
	useFloating,
	useFocusTrap,
	useScrollLock,
	useDisclosure,
	useControllableState,
	useMergedRefs,
	useId,
	useMediaQuery,
	useReduceMotion,
	useKeyboard,
	useDebounce,
	useDebouncedCallback,
	useThrottle,
	useThrottledCallback,
	useResizeObserver,
	useIntersectionObserver,
	useFocusVisible,
	useIsomorphicLayoutEffect,
	usePrevious,
	useDocumentVisibility,
	useOnlineStatus,
	useEventListener,
	useLocalStorage,
	useSessionStorage,
	useCopyToClipboard,
	useTimeout,
	useInterval,
	useElementSize,
	useWindowSize,
	useMutationObserver,
	useLongPress,
	useHotkeys,
	useStateMachine,
	useUndoRedo,
} from './hooks';
export type {
	InteractiveStateOptions,
	InteractiveStateResult,
	UseFloatingOptions,
	UseFloatingResult,
	FloatingSide,
	FloatingAlign,
	FloatingStrategy,
	UseFocusTrapOptions,
	UseDisclosureOptions,
	UseDisclosureResult,
	UseControllableStateOptions,
	KeyboardMap,
	KeyHandler,
	KeyboardHandlerOptions,
	UseKeyboardOptions,
	ElementSize,
	UseIntersectionObserverOptions,
	UseFocusVisibleResult,
	UseStorageOptions,
	UseStorageResult,
	UseCopyToClipboardOptions,
	UseCopyToClipboardResult,
	UseTimeoutOptions,
	UseTimeoutResult,
	UseIntervalOptions,
	UseIntervalResult,
	WindowSize,
	UseMutationObserverOptions,
	UseLongPressOptions,
	LongPressHandlers,
	UseHotkeysOptions,
	HotkeyMap,
	HotkeyHandler,
	StateMachineConfig,
	UseStateMachineOptions,
	UseStateMachineResult,
	UseUndoRedoOptions,
	UseUndoRedoResult,
} from './hooks';

// Internationalization — provider, locale/messages hooks, and Intl formatters
export {
	WireUIProvider,
	useWireUILocale,
	useWireUIMessages,
	useWireUI,
	DEFAULT_LOCALE,
} from './context';
export type { WireUIProviderProps } from './context';
export {
	formatDate,
	formatNumber,
	formatRelativeTime,
	parseLocaleNumber,
	getDayNames,
	getMonthNames,
	getDateTimeFormat,
	getNumberFormat,
	getRelativeTimeFormat,
} from './utils/i18n/formatters';
export { defaultMessages, mergeMessages } from './utils/i18n/messages';
export type { WireUIMessages, PartialMessages } from './utils/i18n/messages';

// Security helpers — reuse the built-in URL sanitizer in custom renderers
export { sanitizeUrl } from './utils/sanitize-url';
export type { SanitizeUrlOptions } from './utils/sanitize-url';

// Types
export type {
	Size,
	Status,
	HorizontalPosition,
	BaseFormFieldProps,
	BaseOption,
} from './types';

// Component types
export type {
	AccordionRootProps,
	AccordionItemProps,
	AccordionTriggerProps,
	AccordionContentProps,
} from './components/accordion';
export type { AlertRootProps, AlertTitleProps, AlertDescriptionProps, AlertDismissProps } from './components/alert';
export type { AvatarRootProps, AvatarImageProps, AvatarFallbackProps, AvatarImageStatus } from './components/avatar';
export type { BadgeProps } from './components/badge';
export type { ButtonProps } from './components/button';
export type { CardProps } from './components/card';
export type { DividerProps } from './components/divider';
export type {
	CheckboxRootProps,
	CheckboxItemProps,
	CheckboxIndicatorProps,
	CheckboxLabelProps,
} from './components/checkbox';
export type {
	DrawerRootProps,
	DrawerPortalProps,
	DrawerOverlayProps,
	DrawerContentProps,
	DrawerHeaderProps,
	DrawerCloseProps,
} from './components/drawer';
export type {
	DropdownRootProps,
	DropdownTriggerProps,
	DropdownMenuProps,
	DropdownPosition,
} from './components/dropdown';
export type { IconProps, IconName, IconSize } from './components/icon';
export type { ImageProps } from './components/image';
export type {
	InputRootProps,
	InputFieldProps,
	InputLabelProps,
	InputErrorProps,
} from './components/input';
export type { ListProps } from './components/list';
export type {
	ModalRootProps,
	ModalPortalProps,
	ModalOverlayProps,
	ModalContentProps,
	ModalCloseProps,
} from './components/modal';
export type { OTPRootProps, OTPSlotProps, OTPSeparatorProps } from './components/otp';
export type {
	PasswordRootProps,
	PasswordFieldProps,
	PasswordToggleProps,
	PasswordLabelProps,
	PasswordErrorProps,
} from './components/password';
export type { ProgressBarProps } from './components/progress-bar';
export type {
	RadioRootProps,
	RadioItemProps,
	RadioIndicatorProps,
	RadioLabelProps,
} from './components/radio';
export type { RatingProps } from './components/rating';
export type {
	SearchRootProps,
	SearchInputProps,
	SearchContentProps,
	SearchItemProps,
	SearchEmptyProps,
	SearchOption,
} from './components/search';
export type {
	SelectRootProps,
	SelectTriggerProps,
	SelectValueProps,
	SelectContentProps,
	SelectItemProps,
	SelectSeparatorProps,
	SelectGroupProps,
	SelectGroupLabelProps,
} from './components/select';
export type { SwitchRootProps, SwitchThumbProps } from './components/switch';
export type {
	TextareaRootProps,
	TextareaFieldProps,
	TextareaLabelProps,
	TextareaErrorProps,
} from './components/textarea';
export type { TimeagoProps, TimeagoFormatConfig, TimeagoPlural } from './components/timeago';
export type { TooltipRootProps, TooltipTriggerProps, TooltipContentProps } from './components/tooltip';
export type {
	PopoverRootProps,
	PopoverTriggerProps,
	PopoverContentProps,
	PopoverCloseProps,
	PopoverSide,
	PopoverAlign,
} from './components/popover';
export type {
	TabsRootProps,
	TabsListProps,
	TabsTriggerProps,
	TabsContentProps,
	TabsOrientation,
	TabsActivationMode,
} from './components/tabs';
export type {
	SliderProps,
	SliderSingleProps,
	SliderRangeProps,
	SliderOrientation,
} from './components/slider';
export type { AspectRatioProps } from './components/aspect-ratio';
export type {
	BreadcrumbRootProps,
	BreadcrumbListProps,
	BreadcrumbItemProps,
	BreadcrumbLinkProps,
	BreadcrumbSeparatorProps,
} from './components/breadcrumb';
export type { TagRootProps, TagLabelProps, TagRemoveProps } from './components/tag';
export type {
	NumberInputRootProps,
	NumberInputFieldProps,
	NumberInputIncrementProps,
	NumberInputDecrementProps,
} from './components/number-input';
export type {
	TagInputRootProps,
	TagInputListProps,
	TagInputFieldProps,
} from './components/tag-input';
export type {
	FileUploadRootProps,
	FileUploadInputProps,
	FileUploadTriggerProps,
	FileUploadDropzoneProps,
} from './components/file-upload';
export type {
	ToastProviderProps,
	ToastViewportProps,
	ToastRootProps,
	ToastTitleProps,
	ToastDescriptionProps,
	ToastCloseProps,
	ToastStatus,
	ToastData,
} from './components/toast';
export type {
	ComboboxRootProps,
	ComboboxInputProps,
	ComboboxTriggerProps,
	ComboboxContentProps,
	ComboboxEmptyProps,
	ComboboxItemRenderProps,
	ComboboxItemsProps,
	ComboboxOption,
} from './components/combobox';
export type {
	TreeViewRootProps,
	TreeNode,
	TreeItemState,
	TreeSelectionMode,
} from './components/tree-view';
export type { SpinnerProps } from './components/spinner';
export type { SkeletonProps } from './components/skeleton';
export type {
	FormRootProps,
	FormFieldProps,
	FormLabelProps,
	FormControlProps,
	FormDescriptionProps,
	FormErrorProps,
} from './components/form';
export type {
	PaginationRootProps,
	PaginationListProps,
	PaginationItemProps,
	PaginationButtonProps,
	PaginationEllipsisProps,
	PaginationItemValue,
} from './components/pagination';
export type {
	PanelGroupProps,
	PanelProps,
	PanelHandleProps,
	PanelOrientation,
} from './components/resizable-panels';
export type {
	CalendarRootProps,
	CalendarNavProps,
	CalendarPrevButtonProps,
	CalendarNextButtonProps,
	CalendarTitleProps,
	CalendarGridProps,
	CalendarDay,
	WeekStart,
} from './components/calendar';
export type {
	DatePickerRootProps,
	DatePickerTriggerProps,
	DatePickerValueProps,
	DatePickerContentProps,
} from './components/date-picker';
export type {
	ContextMenuRootProps,
	ContextMenuTriggerProps,
	ContextMenuContentProps,
	ContextMenuItemProps,
	ContextMenuSeparatorProps,
} from './components/context-menu';
export type {
	MenuBarRootProps,
	MenuBarMenuProps,
	MenuBarTriggerProps,
	MenuBarContentProps,
	MenuBarItemProps,
	MenuBarSeparatorProps,
} from './components/menu-bar';
export type {
	NavigationMenuRootProps,
	NavigationMenuListProps,
	NavigationMenuItemProps,
	NavigationMenuTriggerProps,
	NavigationMenuContentProps,
	NavigationMenuLinkProps,
} from './components/navigation-menu';

// AI-native primitives
export type {
	TypewriterRootProps,
	TypewriterTextProps,
	TypewriterCursorProps,
	TypewriterState,
	TypewriterMode,
} from './components/typewriter';
export type {
	MarkdownProps,
	MarkdownNode,
	MarkdownNodeType,
	MarkdownComponent,
	MarkdownComponents,
	MarkdownComponentProps,
} from './components/markdown';
export type {
	CodeBlockRootProps,
	CodeBlockCodeProps,
	CodeBlockLinesProps,
	CodeBlockCopyButtonProps,
	CodeBlockLine,
	CodeBlockDiffType,
} from './components/code-block';
export type {
	CitationRootProps,
	CitationRefProps,
	CitationListProps,
	CitationSource,
	CitationRenderProps,
} from './components/citation';
export type {
	DiffRootProps,
	DiffUnifiedProps,
	DiffSplitProps,
	DiffStatsProps,
	DiffLine,
	DiffLineType,
	DiffRow,
	DiffStats,
} from './components/diff';
export type {
	MentionRootProps,
	MentionInputProps,
	MentionContentProps,
	MentionItemsProps,
	MentionEmptyProps,
	MentionOption,
	MentionItemRenderProps,
	MentionCoords,
} from './components/mention';
export type {
	ChatRootProps,
	ChatListProps,
	ChatMessageProps,
	ChatComposerProps,
	ChatInputProps,
	ChatSendProps,
} from './components/chat';

// Gap-fillers (table-stakes primitives)
export type {
	EmptyStateRootProps,
	EmptyStateMediaProps,
	EmptyStateTitleProps,
	EmptyStateDescriptionProps,
	EmptyStateActionsProps,
} from './components/empty-state';
export type {
	EditableRootProps,
	EditablePreviewProps,
	EditableInputProps,
	EditableAreaProps,
	EditableEditTriggerProps,
	EditableSubmitTriggerProps,
	EditableCancelTriggerProps,
} from './components/editable';
export type {
	StepperRootProps,
	StepperListProps,
	StepperItemProps,
	StepperTriggerProps,
	StepperSeparatorProps,
	StepperContentProps,
	StepperPrevTriggerProps,
	StepperNextTriggerProps,
	StepperOrientation,
} from './components/stepper';
export type {
	ToolbarRootProps,
	ToolbarButtonProps,
	ToolbarLinkProps,
	ToolbarSeparatorProps,
	ToolbarOrientation,
} from './components/toolbar';
export type {
	HoverCardRootProps,
	HoverCardTriggerProps,
	HoverCardContentProps,
	HoverCardSide,
} from './components/hover-card';
export type { VirtualizerRootProps, VirtualizerOrientation, VirtualItem } from './components/virtualizer';
export type {
	ScrollAreaRootProps,
	ScrollAreaViewportProps,
	ScrollAreaScrollbarProps,
	ScrollAreaThumbProps,
	ScrollAreaOrientation,
	ScrollAreaMetrics,
} from './components/scroll-area';
export type {
	CarouselRootProps,
	CarouselViewportProps,
	CarouselContentProps,
	CarouselSlideProps,
	CarouselPreviousProps,
	CarouselNextProps,
	CarouselIndicatorsProps,
	CarouselIndicatorRenderProps,
	CarouselOrientation,
} from './components/carousel';
export type {
	CommandRootProps,
	CommandInputProps,
	CommandListProps,
	CommandGroupProps,
	CommandItemProps,
	CommandSeparatorProps,
	CommandEmptyProps,
	CommandFilter,
} from './components/command';
export type {
	ColorPickerRootProps,
	ColorPickerAreaProps,
	ColorPickerAreaThumbProps,
	ColorPickerHueProps,
	ColorPickerHueThumbProps,
	ColorPickerAlphaProps,
	ColorPickerAlphaThumbProps,
	ColorPickerSwatchProps,
	ColorPickerInputProps,
	HSVA,
	RGBA,
} from './components/color-picker';
export type {
	ToggleProps,
	ToggleGroupRootProps,
	ToggleGroupSingleProps,
	ToggleGroupMultipleProps,
	ToggleOrientation,
} from './components/toggle';
export type {
	StatRootProps,
	StatLabelProps,
	StatValueProps,
	StatDeltaProps,
	StatHelpTextProps,
	StatSparklineProps,
	StatDirection,
} from './components/stat';
export type {
	RichTextRootProps,
	RichTextToolbarProps,
	RichTextActionProps,
	RichTextEditorProps,
	RichTextPreviewProps,
	RichTextMode,
} from './components/rich-text';
export type {
	InfiniteScrollRootProps,
	InfiniteScrollSentinelProps,
	InfiniteScrollLoaderProps,
	InfiniteScrollEndMessageProps,
} from './components/infinite-scroll';
export type {
	SheetRootProps,
	SheetTriggerProps,
	SheetPortalProps,
	SheetOverlayProps,
	SheetContentProps,
	SheetHandleProps,
	SheetTitleProps,
	SheetDescriptionProps,
	SheetCloseProps,
	SheetSide,
} from './components/sheet';
