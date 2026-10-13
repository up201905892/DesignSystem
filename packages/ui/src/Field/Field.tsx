import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useState,
  type HTMLAttributes,
  type LabelHTMLAttributes,
} from 'react';
import { cx } from '../utils/cx';

interface FieldContextValue {
  id: string;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
  descriptionId: string;
  errorId: string;
  hasDescription: boolean;
  hasError: boolean;
  setHasDescription: (value: boolean) => void;
  setHasError: (value: boolean) => void;
}

const FieldContext = createContext<FieldContextValue | null>(null);

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  /** Id given to the control and used by the label. Generated if missing. */
  id?: string;
  /** Marks the control as invalid and shows the `FieldError`. */
  invalid?: boolean;
  /** Marks the control as required. */
  required?: boolean;
  /** Disables the control. */
  disabled?: boolean;
}

/**
 * Connects a form control with its label, description and error message.
 *
 * @example
 * function TextControl() {
 *   const control = useFieldControl();
 *   return <input {...control} />;
 * }
 *
 * <Field invalid required>
 *   <FieldLabel>Name</FieldLabel>
 *   <TextControl />
 *   <FieldDescription>As on your ID.</FieldDescription>
 *   <FieldError>Name is required.</FieldError>
 * </Field>
 *
 * Accessibility: the label uses `htmlFor`; the control gets `aria-describedby`,
 * `aria-invalid` and `aria-required` from `useFieldControl()`. The error is text, not only color.
 */
export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { id, invalid = false, required = false, disabled = false, className, ...props },
  ref,
) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const [hasDescription, setHasDescription] = useState(false);
  const [hasError, setHasError] = useState(false);

  const value = useMemo<FieldContextValue>(
    () => ({
      id: controlId,
      invalid,
      required,
      disabled,
      descriptionId: `${controlId}-description`,
      errorId: `${controlId}-error`,
      hasDescription,
      hasError,
      setHasDescription,
      setHasError,
    }),
    [controlId, invalid, required, disabled, hasDescription, hasError],
  );

  return (
    <FieldContext.Provider value={value}>
      <div
        ref={ref}
        className={cx('ds-field', className)}
        data-invalid={invalid ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        {...props}
      />
    </FieldContext.Provider>
  );
});

Field.displayName = 'Field';

export interface FieldControlProps {
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  'aria-required'?: true;
  disabled?: true;
}

/**
 * Returns the props a control needs to be linked to its `Field`. Outside a `Field`
 * every value is `undefined`, so the control still works on its own.
 */
export function useFieldControl(): FieldControlProps {
  const field = useContext(FieldContext);
  if (!field) return {};
  const ids = [
    field.hasDescription ? field.descriptionId : null,
    field.invalid && field.hasError ? field.errorId : null,
  ].filter(Boolean);
  return {
    id: field.id,
    'aria-describedby': ids.length > 0 ? ids.join(' ') : undefined,
    'aria-invalid': field.invalid ? true : undefined,
    'aria-required': field.required ? true : undefined,
    disabled: field.disabled ? true : undefined,
  };
}

export type FieldLabelProps = LabelHTMLAttributes<HTMLLabelElement>;

/** The `<label>` of the control. Shows a decorative `*` when the field is required. */
export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(function FieldLabel(
  { className, children, ...props },
  ref,
) {
  const field = useContext(FieldContext);
  return (
    <label
      ref={ref}
      htmlFor={field?.id}
      className={cx('ds-field__label', className)}
      data-required={field?.required ? '' : undefined}
      {...props}
    >
      {children}
      {field?.required ? (
        <span className="ds-field__required" aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  );
});

FieldLabel.displayName = 'FieldLabel';

export type FieldDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

/** Help text. Its id is added to the control's `aria-describedby`. */
export const FieldDescription = forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  function FieldDescription({ className, ...props }, ref) {
    const field = useContext(FieldContext);
    const setHasDescription = field?.setHasDescription;
    useLayoutEffect(() => {
      setHasDescription?.(true);
      return () => setHasDescription?.(false);
    }, [setHasDescription]);
    return (
      <p
        ref={ref}
        id={field?.descriptionId}
        className={cx('ds-field__description', className)}
        {...props}
      />
    );
  },
);

FieldDescription.displayName = 'FieldDescription';

export type FieldErrorProps = HTMLAttributes<HTMLParagraphElement>;

/** Error message. Only rendered while the `Field` is `invalid`. */
export const FieldError = forwardRef<HTMLParagraphElement, FieldErrorProps>(function FieldError(
  { className, ...props },
  ref,
) {
  const field = useContext(FieldContext);
  const setHasError = field?.setHasError;
  const visible = field?.invalid ?? false;
  useLayoutEffect(() => {
    if (!visible) return undefined;
    setHasError?.(true);
    return () => setHasError?.(false);
  }, [visible, setHasError]);
  if (!visible) return null;
  return (
    <p ref={ref} id={field?.errorId} className={cx('ds-field__error', className)} {...props} />
  );
});

FieldError.displayName = 'FieldError';
