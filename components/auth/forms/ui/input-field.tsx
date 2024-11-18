import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: React.ReactNode;
  type?: React.ComponentProps<"input">["type"];
  placeholder: string;
  icon: React.ReactNode;
  control: UseFormReturn<T>["control"];
}

export function InputField<T extends FieldValues>({
  name,
  label,
  type = "text",
  placeholder,
  icon,
  control,
}: Readonly<FormFieldProps<T>>) {
  const [showPassword, setShowPassword] = useState(false);
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
}
