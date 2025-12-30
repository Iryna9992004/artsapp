import { UseFormRegisterReturn } from "react-hook-form";
export interface InputProps {
  placeholder: string;
  register: UseFormRegisterReturn<string>;
  type?: "password" | "text";
  errorMessage?: string;
  disabled?: boolean;
}
