"use client";

import * as React from "react";

import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  AlertCircle,
  Check,
  CheckCircle,
  ChevronsUpDown,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Control,
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  const value = React.useMemo(() => ({ name: props.name }), [props.name]);

  return (
    <FormFieldContext.Provider value={value}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();
  const value = React.useMemo(() => ({ id }), [id]);

  return (
    <FormItemContext.Provider value={value}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ComponentRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

interface FormAlertProps {
  error?: string;
  success?: string;
}

const FormAlert = ({ error, success }: FormAlertProps) => {
  if (!error && !success) {
    return null;
  }

  const isError = !!error;
  const message = error ?? success;

  return (
    <Alert variant={isError ? "destructive" : "default"}>
      {isError ? (
        <AlertCircle className="h-4 w-4" />
      ) : (
        <CheckCircle className="h-4 w-4" />
      )}
      <AlertTitle>{message}</AlertTitle>
    </Alert>
  );
};

interface FormInputFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldPath<TFieldValues>;
  label: React.ReactNode;
  type?: React.HTMLInputTypeAttribute;
  placeholder: string;
  icon: React.ReactNode;
  control: Control<TFieldValues>;
}
const FormInputField = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  type = "text",
  placeholder,
  icon,
  control,
}: FormInputFieldProps<TFieldValues>) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === "password";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Button
                className="absolute left-0 top-0"
                disabled
                variant="ghost"
              >
                {icon}
              </Button>
              <Input
                className={isPassword ? "px-12" : "pl-12"}
                placeholder={placeholder}
                type={isPassword && !showPassword ? "password" : "text"}
                {...field}
              />
              {isPassword && (
                <Button
                  className="absolute right-0 top-0 text-muted-foreground"
                  data-testid="toggle-visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  variant="ghost"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

interface FormIconInputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  name: FieldPath<TFieldValues>;
  label: React.ReactNode;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  icon: React.ReactNode;
  control: Control<TFieldValues>;
  step?: string;
  inputMode?: "decimal" | "numeric";
}
const FormIconInputField = <TFieldValues extends FieldValues = FieldValues>({
  icon,
  label,
  control,
  name,
  placeholder,
  type = "text",
  step,
  inputMode,
}: FormIconInputFieldProps<TFieldValues>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <div className="relative">
            <Button className="absolute left-0 top-0" disabled variant="ghost">
              {icon}
            </Button>
            <Input
              {...field}
              placeholder={placeholder}
              type={type}
              step={step}
              inputMode={inputMode}
              className="pl-12"
              onBlur={(e) => {
                const value = e.target.value;
                // When input loses focus, format to 2 decimal places
                if (value) {
                  field.onChange(Number(value).toFixed(2));
                }
              }}
            />
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

interface FormSelectFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldPath<TFieldValues>;
  label: React.ReactNode;
  placeholder: string;
  icon: React.ReactNode;
  control: Control<TFieldValues>;
  options: Array<{ value: string; label: string }>;
}
const FormSelectField = <TFieldValues extends FieldValues = FieldValues>({
  icon,
  label,
  control,
  name,
  placeholder,
  options,
}: FormSelectFieldProps<TFieldValues>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <div className="relative">
          <Button className="absolute left-0 top-0" disabled variant="ghost">
            {icon}
          </Button>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className="pl-12">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <FormMessage />
      </FormItem>
    )}
  />
);

interface FormComboboxFieldProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  name: FieldPath<TFieldValues>;
  label: React.ReactNode;
  placeholder: string;
  icon: React.ReactNode;
  control: Control<TFieldValues>;
  items: Array<{ code: string; name: string }>;
  searchPlaceholder: string;
  emptyText: string;
  displayFormat?: (item: { code: string; name: string }) => string;
}
const FormComboboxField = <TFieldValues extends FieldValues = FieldValues>({
  icon,
  label,
  control,
  name,
  placeholder,
  items,
  searchPlaceholder,
  emptyText,
  displayFormat = (item) => item.name,
}: FormComboboxFieldProps<TFieldValues>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex flex-col">
        <FormLabel>{label}</FormLabel>
        <div className="relative">
          <Button className="absolute left-0 top-0" disabled variant="ghost">
            {icon}
          </Button>
          <Popover>
            <PopoverTrigger asChild className="w-full pl-12">
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-between",
                    !field.value && "text-muted-foreground",
                  )}
                  data-testid="combobox-button"
                >
                  {field.value
                    ? displayFormat(
                        items.find((item) => item.code === field.value)!,
                      )
                    : placeholder}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="sm:w-[450px]">
              <Command>
                <CommandInput placeholder={searchPlaceholder} className="h-9" />
                <CommandList>
                  <CommandEmpty>{emptyText}</CommandEmpty>
                  <CommandGroup>
                    {items.map((item) => (
                      <CommandItem
                        value={item.name}
                        key={item.code}
                        onSelect={() => {
                          field.onChange(item.code);
                        }}
                      >
                        {displayFormat(item)}
                        <Check
                          className={cn(
                            "ml-auto",
                            item.code === field.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <FormMessage />
      </FormItem>
    )}
  />
);

interface FormCheckboxFieldProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  item: { code: string; name: string };
}
const FormCheckboxField = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  item,
}: FormCheckboxFieldProps<TFieldValues>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex w-full flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow sm:w-52">
        <FormControl>
          <Checkbox
            checked={field.value?.includes(item.code)}
            onCheckedChange={(checked) => {
              return checked
                ? field.onChange([...field.value, item.code])
                : field.onChange(
                    field.value?.filter((value: string) => value !== item.code),
                  );
            }}
          />
        </FormControl>
        <div className="space-y-1 leading-none">
          <FormLabel>{item.name}</FormLabel>
        </div>
      </FormItem>
    )}
  />
);

export {
  useFormField,
  Form,
  FormAlert,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormInputField,
  FormIconInputField,
  FormSelectField,
  FormComboboxField,
  FormCheckboxField,
};
