import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { LicenseText } from './components/license-text'
import { Preview } from './components/preview'
import { AccordionBasic, AccordionComposed, AccordionComplex } from './components/previews/accordion'
import { AlertBasic, AlertComposed, AlertComplex } from './components/previews/alert'
import { Basic as AvatarBasic, Composed as AvatarComposed, Complex as AvatarComplex } from './components/previews/avatar'
import { BadgeBasic, BadgeComposed, BadgeComplex } from './components/previews/badge'
import { ButtonBasic, ButtonComposed, ButtonComplex } from './components/previews/button'
import { CardBasic, CardComposed, CardComplex } from './components/previews/card'
import { CheckboxBasic, CheckboxComposed, CheckboxComplex } from './components/previews/checkbox'
import { DividerBasic, DividerComposed, DividerComplex } from './components/previews/divider'
import { Basic as DrawerBasic, Composed as DrawerComposed, Complex as DrawerComplex } from './components/previews/drawer'
import { Basic as DropdownBasic, Composed as DropdownComposed, Complex as DropdownComplex } from './components/previews/dropdown'
import { Basic as ImageBasic, Composed as ImageComposed, Complex as ImageComplex } from './components/previews/image'
import { InputBasic, InputComposed, InputComplex } from './components/previews/input'
import { ListBasic, ListComposed, ListComplex } from './components/previews/list'
import { Basic as ModalBasic, Composed as ModalComposed, Complex as ModalComplex } from './components/previews/modal'
import { OtpBasic, OtpComposed, OtpComplex } from './components/previews/otp'
import { PasswordBasic, PasswordComposed, PasswordComplex } from './components/previews/password'
import { ProgressBarBasic, ProgressBarComposed, ProgressBarComplex } from './components/previews/progress-bar'
import { RadioBasic, RadioComposed, RadioComplex } from './components/previews/radio'
import { RatingBasic, RatingComposed, RatingComplex } from './components/previews/rating'
import { SearchBasic, SearchComposed, SearchComplex } from './components/previews/search'
import { SelectBasic, SelectComposed, SelectComplex } from './components/previews/select'
import { SwitchBasic, SwitchComposed, SwitchComplex } from './components/previews/switch'
import { TextareaBasic, TextareaComposed, TextareaComplex } from './components/previews/textarea'
import { Basic as TimeagoBasic, Composed as TimeagoComposed, Complex as TimeagoComplex } from './components/previews/timeago'
import { Basic as TooltipBasic, Composed as TooltipComposed, Complex as TooltipComplex } from './components/previews/tooltip'

export function useMDXComponents(components?: Record<string, React.FC>) {
  return getDocsMDXComponents({
    LicenseText,
    Preview,
    AccordionBasic, AccordionComposed, AccordionComplex,
    AlertBasic, AlertComposed, AlertComplex,
    AvatarBasic, AvatarComposed, AvatarComplex,
    BadgeBasic, BadgeComposed, BadgeComplex,
    ButtonBasic, ButtonComposed, ButtonComplex,
    CardBasic, CardComposed, CardComplex,
    CheckboxBasic, CheckboxComposed, CheckboxComplex,
    DividerBasic, DividerComposed, DividerComplex,
    DrawerBasic, DrawerComposed, DrawerComplex,
    DropdownBasic, DropdownComposed, DropdownComplex,
    ImageBasic, ImageComposed, ImageComplex,
    InputBasic, InputComposed, InputComplex,
    ListBasic, ListComposed, ListComplex,
    ModalBasic, ModalComposed, ModalComplex,
    OtpBasic, OtpComposed, OtpComplex,
    PasswordBasic, PasswordComposed, PasswordComplex,
    ProgressBarBasic, ProgressBarComposed, ProgressBarComplex,
    RadioBasic, RadioComposed, RadioComplex,
    RatingBasic, RatingComposed, RatingComplex,
    SearchBasic, SearchComposed, SearchComplex,
    SelectBasic, SelectComposed, SelectComplex,
    SwitchBasic, SwitchComposed, SwitchComplex,
    TextareaBasic, TextareaComposed, TextareaComplex,
    TimeagoBasic, TimeagoComposed, TimeagoComplex,
    TooltipBasic, TooltipComposed, TooltipComplex,
    ...components,
  })
}
