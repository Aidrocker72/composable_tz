import type { IFieldState } from "@/interfaces/validation/IFieldState";

export type IFormState<T = Record<string, any>> = {
  [K in keyof T]: IFieldState<T[K]>;
};
