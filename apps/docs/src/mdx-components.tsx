import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { Preview } from './components/preview'
import { AccordionPreview } from './components/previews/accordion'
import { AlertPreview } from './components/previews/alert'
import { AvatarPreview } from './components/previews/avatar'
import { BadgePreview } from './components/previews/badge'
import { ButtonPreview } from './components/previews/button'
import { CardPreview } from './components/previews/card'
import { CheckboxPreview } from './components/previews/checkbox'
import { DividerPreview } from './components/previews/divider'
import { DrawerPreview } from './components/previews/drawer'
import { DropdownPreview } from './components/previews/dropdown'
import { ImagePreview } from './components/previews/image'
import { InputPreview } from './components/previews/input'
import { ListPreview } from './components/previews/list'
import { ModalPreview } from './components/previews/modal'
import { OtpPreview } from './components/previews/otp'
import { PasswordPreview } from './components/previews/password'
import { ProgressBarPreview } from './components/previews/progress-bar'
import { RadioPreview } from './components/previews/radio'
import { RatingPreview } from './components/previews/rating'
import { SearchPreview } from './components/previews/search'
import { SelectPreview } from './components/previews/select'
import { SwitchPreview } from './components/previews/switch'
import { TextareaPreview } from './components/previews/textarea'
import { TimeagoPreview } from './components/previews/timeago'
import { TooltipPreview } from './components/previews/tooltip'

export function useMDXComponents(components?: Record<string, React.FC>) {
  return getDocsMDXComponents({
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
