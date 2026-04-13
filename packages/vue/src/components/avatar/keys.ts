import { inject, type InjectionKey } from 'vue';
import type { AvatarImageStatus } from './Avatar.types';

export interface AvatarContextValue {
	imageStatus: AvatarImageStatus;
	setImageStatus: (status: AvatarImageStatus) => void;
}

export const AvatarKey: InjectionKey<AvatarContextValue> = Symbol('AvatarContext');

export function useAvatarContext() {
	const ctx = inject(AvatarKey);
	if (!ctx) throw new Error('[wire-ui] Avatar sub-components must be used inside <Avatar.Root>');
	return ctx;
}
