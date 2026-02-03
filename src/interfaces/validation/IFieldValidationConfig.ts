import type { IValidationRule } from "@/interfaces/validation/IValidationRule";

export interface IFieldValidationConfig<T = any> {
  rules: IValidationRule<T>[];
};
