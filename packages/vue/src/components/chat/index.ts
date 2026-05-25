import ChatRoot from './ChatRoot.vue';
import ChatList from './ChatList.vue';
import ChatMessage from './ChatMessage.vue';
import ChatComposer from './ChatComposer.vue';
import ChatInput from './ChatInput.vue';
import ChatSend from './ChatSend.vue';

export const Chat = {
	Root: ChatRoot,
	List: ChatList,
	Message: ChatMessage,
	Composer: ChatComposer,
	Input: ChatInput,
	Send: ChatSend,
};

export type {
	ChatRootProps,
	ChatListProps,
	ChatMessageProps,
	ChatComposerProps,
	ChatInputProps,
	ChatSendProps,
} from './Chat.types';
