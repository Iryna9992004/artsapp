import { UseFormRegisterReturn } from "react-hook-form";

export interface SendFormProps {
  value: string;
  register: UseFormRegisterReturn<string>;
  disabled?: boolean;
}
