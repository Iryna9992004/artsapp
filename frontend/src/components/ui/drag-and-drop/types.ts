export interface DragAndPropsProps {
  value?: File;
  setValue: (value: File | null) => void;
  errorMessage: string | null;
  disabled?: boolean;
}
