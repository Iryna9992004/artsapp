import { UseFormRegisterReturn } from "react-hook-form";

export interface SearchInputProps {
  value: string;
  register: UseFormRegisterReturn<string>;
}
