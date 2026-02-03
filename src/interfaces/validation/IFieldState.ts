export interface IFieldState<T = any> {
  value: T;
  errors: string[];
  isValid: boolean;
  isDirty: boolean;
};
