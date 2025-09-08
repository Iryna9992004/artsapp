export interface InputProps {
    placeholder: string;
    value: string;
    setValue: (text:string) => void;
    type?: 'password' | "text";
}