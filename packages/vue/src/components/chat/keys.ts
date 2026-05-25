import { inject, type InjectionKey } from 'vue';
import type { ChatContextValue } from './Chat.types';

export const ChatKey: InjectionKey<ChatContextValue> = Symbol('ChatContext');

export function useChatContext() {
	const ctx = inject(ChatKey);
	if (!ctx) throw new Error('Chat.Input/Composer/Send must be used within Chat.Root');
	return ctx;
}
