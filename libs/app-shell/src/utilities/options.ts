export interface Option<T = string> {
  value: T;
  label?: string;
  title?: string;
}

export interface SelectableOption<T = string> extends Option<T> {
  selected: boolean;
}
