import AlertRoot from './AlertRoot.vue';
import AlertTitle from './AlertTitle.vue';
import AlertDescription from './AlertDescription.vue';
import AlertDismiss from './AlertDismiss.vue';

export const Alert = { Root: AlertRoot, Title: AlertTitle, Description: AlertDescription, Dismiss: AlertDismiss };
export type { AlertRootProps, AlertTitleProps, AlertDescriptionProps, AlertDismissProps } from './Alert.types';
