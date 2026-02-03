import { reactive, computed } from 'vue';
import type { IFormValidationConfig } from '@/interfaces/validation/IFormValidationConfig';
import type { IFormState } from '@/interfaces/validation/IFormState';
import type { IValidationResult } from '@/interfaces/validation/IValidationResult';

export function useFormValidation<T extends Record<string, any>>(initialData: T, config: IFormValidationConfig<T>) {
  const formState = reactive({}) as IFormState<T>;
  
  Object.keys(initialData).forEach(fieldName => {
    (formState as any)[fieldName] = {
      value: initialData[fieldName],
      errors: [],
      isValid: true,
      isDirty: false
    };
  });

  const validateField = (fieldName: keyof T): boolean => {
    const fieldConfig = (config as any)[fieldName];
    if (!fieldConfig) return true;
    
    const fieldState = (formState as any)[fieldName];
    if (!fieldState) return true;
    
    const errors: string[] = [];
    
    for (const rule of fieldConfig.rules) {
      if (!rule.validate(fieldState.value)) {
        errors.push(rule.message);
      }
    }
    
    fieldState.errors = errors;
    fieldState.isValid = errors.length === 0;
    
    return fieldState.isValid;
  };

  const validateAll = (): IValidationResult => {
    let isFormValid = true;
    const allErrors: Record<string, string[]> = {};

    Object.keys(config).forEach(fieldName => {
      const isFieldValid = validateField(fieldName as keyof T);
      if (!isFieldValid) {
        isFormValid = false;
        const fieldState = (formState as any)[fieldName];
        if (fieldState) {
          allErrors[fieldName] = fieldState.errors;
        }
      }
    });

    return {
      isValid: isFormValid,
      errors: allErrors
    };
  };

  const markFieldDirty = (fieldName: keyof T) => {
    const fieldState = (formState as any)[fieldName];
    if (fieldState) {
      fieldState.isDirty = true;
    }
  };

  const updateFieldValue = (fieldName: keyof T, value: any, shouldValidate = true) => {
    const fieldState = (formState as any)[fieldName];
    if (fieldState) {
      fieldState.value = value;
      
      if (shouldValidate) {
        validateField(fieldName);
      }
    }
  };

  const isFormValid = computed(() => {
    return Object.values(formState).every((field: any) => field.isValid);
  });

  const isFormDirty = computed(() => {
    return Object.values(formState).some((field: any) => field.isDirty);
  });

  const resetForm = (newData?: T) => {
    const dataToUse = newData || initialData;
    
    Object.keys(dataToUse).forEach(fieldName => {
      const fieldState = (formState as any)[fieldName];
      if (fieldState) {
        fieldState.value = dataToUse[fieldName];
        fieldState.errors = [];
        fieldState.isValid = true;
        fieldState.isDirty = false;
      }
    });
  };

  return {
    formState,
    isFormValid,
    isFormDirty,
    validateField,
    validateAll,
    markFieldDirty,
    updateFieldValue,
    resetForm
  };
}