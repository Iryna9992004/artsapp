export interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: "submit" | "text";
  variant?: "primary" | "secondary";
}
