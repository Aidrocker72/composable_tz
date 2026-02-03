import type { IFieldValidationConfig } from "@/interfaces/validation/IFieldValidationConfig";

export type IFormValidationConfig<T = Record<string, any>> = {
  [K in keyof T]: IFieldValidationConfig<T[K]>;
};
