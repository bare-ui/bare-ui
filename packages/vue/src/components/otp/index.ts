import OTPRoot from './OTPRoot.vue';
import OTPSlot from './OTPSlot.vue';
import OTPSeparator from './OTPSeparator.vue';

export const OTP = { Root: OTPRoot, Slot: OTPSlot, Separator: OTPSeparator };
export type {
	OTPRootProps,
	OTPSlotProps,
	OTPSeparatorProps,
	OTPContextValue,
} from './OTP.types';
