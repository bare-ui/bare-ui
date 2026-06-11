export interface TooltipContextValue {
	open: boolean;
	setOpen: (value: boolean) => void;
	contentId: string;
}

export interface TooltipRootProps {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (value: boolean) => void;
	delayDuration?: number;
}

export interface TooltipTriggerProps {
	class?: string;
}

export interface TooltipContentProps {
	side?: 'top' | 'bottom' | 'left' | 'right';
	class?: string;
}
