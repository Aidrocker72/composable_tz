export interface IValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
};
