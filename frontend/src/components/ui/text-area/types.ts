import { UseFormRegisterReturn } from "react-hook-form";

export interface TextAreaProps {
  placeholder: string;
  register: UseFormRegisterReturn;
  errorMessage?: string;
}
