import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { ForReact, ForVue, ForSolid } from './components/code-block'
import { FeatureList, FeatureItem } from './components/feature-list'
import { LicenseText } from './components/license-text'
import { Preview } from './components/preview'
import { AccordionBasic as AccordionPreview } from './components/previews/accordion'
import { AlertComplex as AlertPreview } from './components/previews/alert'
import { AvatarPreview } from './components/previews/avatar'
import { BadgeBasic as BadgePreview } from './components/previews/badge'
import { ButtonBasic as ButtonPreview } from './components/previews/button'
import { CardComposed as CardPreview } from './components/previews/card'
import { CheckboxComposed as CheckboxPreview } from './components/previews/checkbox'
import { DividerPreview } from './components/previews/divider'
import { Basic as DrawerPreview } from './components/previews/drawer'
import { Basic as DropdownPreview } from './components/previews/dropdown'
import { IconPreview } from './components/previews/icon'
import { Basic as ImagePreview } from './components/previews/image'
import { InputBasic as InputPreview } from './components/previews/input'
import { ListComplex as ListPreview } from './components/previews/list'
import { Composed as ModalPreview } from './components/previews/modal'
import { OtpComplex as OtpPreview } from './components/previews/otp'
import { PasswordComplex as PasswordPreview } from './components/previews/password'
import { ProgressBarComplex as ProgressBarPreview } from './components/previews/progress-bar'
import { RadioComplex as RadioPreview } from './components/previews/radio'
import { RatingComplex as RatingPreview } from './components/previews/rating'
import { SearchBasic as SearchPreview } from './components/previews/search'
import { SelectBasic as SelectPreview } from './components/previews/select'
import { SwitchComposed as SwitchPreview } from './components/previews/switch'
import { TextareaBasic as TextareaPreview } from './components/previews/textarea'
import { Composed as TimeagoPreview } from './components/previews/timeago'
import { Basic as TooltipPreview } from './components/previews/tooltip'

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
    AvatarPreview,
    BadgePreview,
    ButtonPreview,
    CardPreview,
    CheckboxPreview,
    DividerPreview,
    DrawerPreview,
    DropdownPreview,
    IconPreview,
    ImagePreview,
    InputPreview,
    ListPreview,
    ModalPreview,
    OtpPreview,
    PasswordPreview,
    ProgressBarPreview,
    RadioPreview,
    RatingPreview,
    SearchPreview,
    SelectPreview,
    SwitchPreview,
    TextareaPreview,
    TimeagoPreview,
    TooltipPreview,
    ...components,
  })
}
