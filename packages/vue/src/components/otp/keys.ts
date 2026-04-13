import { inject, type InjectionKey } from 'vue'
import type { OTPContextValue } from './OTP.types'

export const OTPKey: InjectionKey<OTPContextValue> = Symbol('OTPContext')

export function useOTPContext() {
  const ctx = inject(OTPKey)
  if (!ctx) throw new Error('OTP.Slot and OTP.Separator must be used within OTP.Root')
  return ctx
}
