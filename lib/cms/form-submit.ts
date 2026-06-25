import { toast } from "sonner";
import type { FieldErrors, FieldValues, UseFormReturn } from "react-hook-form";
import {
  countFormErrors,
  getErrorPaths,
  getFirstErrorPath,
} from "@/lib/cms/form-errors";

type FormValidationFeedbackOptions = {
  validationMessage: (count: number, paths: string[], firstPath: string | null) => string;
  onSectionChange?: (section: string) => void;
  resolveSection?: (path: string) => string;
};

export function handleFormValidationFailure<T extends FieldValues>(
  form: UseFormReturn<T>,
  errors: FieldErrors<T>,
  options: FormValidationFeedbackOptions,
) {
  const total = countFormErrors(errors);
  const firstPath = getFirstErrorPath(errors);
  const paths = getErrorPaths(errors);
  const message = options.validationMessage(total, paths, firstPath);

  if (firstPath && options.onSectionChange && options.resolveSection) {
    options.onSectionChange(options.resolveSection(firstPath));
  }

  toast.error(message);

  if (firstPath) {
    queueMicrotask(() => {
      form.setFocus(firstPath as never);
    });
  }

  return { message, firstPath, paths, total };
}
