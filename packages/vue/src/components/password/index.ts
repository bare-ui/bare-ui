import PasswordRoot from './PasswordRoot.vue';
import PasswordField from './PasswordField.vue';
import PasswordToggle from './PasswordToggle.vue';
import PasswordLabel from './PasswordLabel.vue';
import PasswordError from './PasswordError.vue';

export const Password = { Root: PasswordRoot, Field: PasswordField, Toggle: PasswordToggle, Label: PasswordLabel, Error: PasswordError };
export type { PasswordRootProps, PasswordFieldProps, PasswordToggleProps, PasswordLabelProps, PasswordErrorProps, PasswordContextValue } from './Password.types';
