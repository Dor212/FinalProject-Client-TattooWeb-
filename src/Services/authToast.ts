export { toast as default, toast, dialog, getHttpErrorMessage } from "./toast";

import { toast as t } from "./toast";

export const toastSuccess = (title: string, text?: string) => t.success(title, text);
export const toastError = (title: string, text?: string) => t.error(title, text);
export const toastWarning = (title: string, text?: string) => t.warning(title, text);
export const toastInfo = (title: string, text?: string) => t.info(title, text);
