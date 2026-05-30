import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { ForReact, ForVue, ForSolid } from './components/code-block'
import { FeatureList, FeatureItem } from './components/feature-list'
import { LicenseText } from './components/license-text'
import { Preview } from './components/preview'
import { AccordionBasic as AccordionPreview } from './components/previews/accordion'
import { AlertComplex as AlertPreview } from './components/previews/alert'
import { AspectRatioPreview } from './components/previews/aspect-ratio'
import { AvatarPreview } from './components/previews/avatar'
import { BadgeBasic as BadgePreview } from './components/previews/badge'
import { BreadcrumbPreview } from './components/previews/breadcrumb'
import { ButtonBasic as ButtonPreview } from './components/previews/button'
import { CalendarPreview } from './components/previews/calendar'
import { CardComposed as CardPreview } from './components/previews/card'
import { CarouselPreview } from './components/previews/carousel'
import { ChatPreview } from './components/previews/chat'
import { CheckboxComposed as CheckboxPreview } from './components/previews/checkbox'
import { CitationPreview } from './components/previews/citation'
import { CodeBlockPreview } from './components/previews/code-block'
import { ColorPickerPreview } from './components/previews/color-picker'
import { ComboboxPreview } from './components/previews/combobox'
import { CommandPreview } from './components/previews/command'
import { ContextMenuPreview } from './components/previews/context-menu'
import { DatePickerPreview } from './components/previews/date-picker'
import { DiffPreview } from './components/previews/diff'
import { DividerPreview } from './components/previews/divider'
import { Basic as DrawerPreview } from './components/previews/drawer'
import { Basic as DropdownPreview } from './components/previews/dropdown'
import { EditablePreview } from './components/previews/editable'
import { EmptyStatePreview } from './components/previews/empty-state'
import { FileUploadPreview } from './components/previews/file-upload'
import { FormPreview } from './components/previews/form'
import { HoverCardPreview } from './components/previews/hover-card'
import { IconPreview } from './components/previews/icon'
import { Basic as ImagePreview } from './components/previews/image'
import { InfiniteScrollPreview } from './components/previews/infinite-scroll'
import { InputBasic as InputPreview } from './components/previews/input'
import { ListComplex as ListPreview } from './components/previews/list'
import { MarkdownPreview } from './components/previews/markdown'
import { MentionPreview } from './components/previews/mention'
import { MenuBarPreview } from './components/previews/menu-bar'
import { Composed as ModalPreview } from './components/previews/modal'
import { NavigationMenuPreview } from './components/previews/navigation-menu'
import { NumberInputPreview } from './components/previews/number-input'
import { OtpComplex as OtpPreview } from './components/previews/otp'
import { PaginationPreview } from './components/previews/pagination'
import { PasswordComplex as PasswordPreview } from './components/previews/password'
import { PopoverPreview } from './components/previews/popover'
import { ProgressBarComplex as ProgressBarPreview } from './components/previews/progress-bar'
import { RadioComplex as RadioPreview } from './components/previews/radio'
import { RatingComplex as RatingPreview } from './components/previews/rating'
import { ResizablePanelsPreview } from './components/previews/resizable-panels'
import { RichTextPreview } from './components/previews/rich-text'
import { ScrollAreaPreview } from './components/previews/scroll-area'
import { SearchBasic as SearchPreview } from './components/previews/search'
import { SelectBasic as SelectPreview } from './components/previews/select'
import { SheetPreview } from './components/previews/sheet'
import { SkeletonPreview } from './components/previews/skeleton'
import { SliderPreview } from './components/previews/slider'
import { SpinnerPreview } from './components/previews/spinner'
import { StatPreview } from './components/previews/stat'
import { StepperPreview } from './components/previews/stepper'
import { SwitchComposed as SwitchPreview } from './components/previews/switch'
import { TabsPreview } from './components/previews/tabs'
import { TagPreview } from './components/previews/tag'
import { TagInputPreview } from './components/previews/tag-input'
import { TextareaBasic as TextareaPreview } from './components/previews/textarea'
import { Composed as TimeagoPreview } from './components/previews/timeago'
import { ToastPreview } from './components/previews/toast'
import { TogglePreview } from './components/previews/toggle'
import { ToolbarPreview } from './components/previews/toolbar'
import { Basic as TooltipPreview } from './components/previews/tooltip'
import { TreeViewPreview } from './components/previews/tree-view'
import { TypewriterPreview } from './components/previews/typewriter'
import { VirtualizerPreview } from './components/previews/virtualizer'

export function useMDXComponents(components?: Record<string, React.FC>) {
  return getDocsMDXComponents({
    ForReact,
    ForVue,
    ForSolid,
    FeatureList,
    FeatureItem,
    LicenseText,
    Preview,
    AccordionPreview,
    AlertPreview,
    AspectRatioPreview,
    AvatarPreview,
    BadgePreview,
    BreadcrumbPreview,
    ButtonPreview,
    CalendarPreview,
    CardPreview,
    CarouselPreview,
    ChatPreview,
    CheckboxPreview,
    CitationPreview,
    CodeBlockPreview,
    ColorPickerPreview,
    ComboboxPreview,
    CommandPreview,
    ContextMenuPreview,
    DatePickerPreview,
    DiffPreview,
    DividerPreview,
    DrawerPreview,
    DropdownPreview,
    EditablePreview,
    EmptyStatePreview,
    FileUploadPreview,
    FormPreview,
    HoverCardPreview,
    IconPreview,
    ImagePreview,
    InfiniteScrollPreview,
    InputPreview,
    ListPreview,
    MarkdownPreview,
    MentionPreview,
    MenuBarPreview,
    ModalPreview,
    NavigationMenuPreview,
    NumberInputPreview,
    OtpPreview,
    PaginationPreview,
    PasswordPreview,
    PopoverPreview,
    ProgressBarPreview,
    RadioPreview,
    RatingPreview,
    ResizablePanelsPreview,
    RichTextPreview,
    ScrollAreaPreview,
    SearchPreview,
    SelectPreview,
    SheetPreview,
    SkeletonPreview,
    SliderPreview,
    SpinnerPreview,
    StatPreview,
    StepperPreview,
    SwitchPreview,
    TabsPreview,
    TagPreview,
    TagInputPreview,
    TextareaPreview,
    TimeagoPreview,
    ToastPreview,
    TogglePreview,
    ToolbarPreview,
    TooltipPreview,
    TreeViewPreview,
    TypewriterPreview,
    VirtualizerPreview,
    ...components,
  })
}
