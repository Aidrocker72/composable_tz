export interface IValidationRule<T = any> {
  validate: (value: T) => boolean;
  message: string;
};
