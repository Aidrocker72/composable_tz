# Универсальные Composables для Vue 3

Этот проект содержит реализацию двух универсальных composables для Vue 3 с использованием TypeScript:

## 1. Композабл валидации форм (`useFormValidation`)

### Описание
Универсальный composable для валидации форм, который позволяет:
- Проверять данные формы по заданным правилам
- Возвращать реактивное состояние валидности формы
- Управлять состоянием каждого поля формы (значения, ошибки, валидность, грязность)
- Поддерживать произвольное количество полей и правил валидации

### Типы
```typescript
// types/validation.ts
export interface IValidationRule<T = any> {
  validate: (value: T) => boolean;
  message: string;
}

export interface IFieldValidationConfig<T = any> {
  rules: ValidationRule<T>[];
}

export type IFormValidationConfig<T = Record<string, any>> = {
  [K in keyof T]: FieldValidationConfig<T[K]>;
};

export interface IFieldState<T = any> {
  value: T;
  errors: string[];
  isValid: boolean;
  isDirty: boolean;
}

export interface IFormState<T = Record<string, any>> {
  [fieldName: string]: FieldState<T>;
};

export interface IValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}
```

### Использование
```typescript
import { useFormValidation } from './composables/useFormValidation';

const initialFormData = {
  name: '',
  email: '',
  password: ''
};

const validationRules = {
  name: {
    rules: [
      {
        validate: (value: string) => !!value.trim(),
        message: 'Имя обязательно для заполнения'
      },
      {
        validate: (value: string) => value.trim().length >= 2,
        message: 'Имя должно содержать не менее 2 символов'
      }
    ]
  },
  email: {
    rules: [
      {
        validate: (value: string) => !!value.trim(),
        message: 'Email обязателен для заполнения'
      },
      {
        validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Введите корректный email адрес'
      }
    ]
  }
};

const {
  formState,
  isFormValid,
  validateField,
  validateAll,
  markFieldDirty,
  updateFieldValue,
  resetForm
} = useFormValidation(initialFormData, validationRules);
```

## 2. Композабл HTTP-запросов (`useHttp`)

### Описание
Универсальный composable для выполнения HTTP-запросов, который позволяет:
- Выполнять GET, POST, PUT, DELETE, PATCH и другие HTTP-методы
- Возвращать реактивные данные запроса
- Управлять состоянием загрузки, ошибки, успеха
- Обрабатывать различные типы ответов

### Типы
```typescript
// types/http.ts
export interface IHttpRequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number | boolean>;
}

export interface IHttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export interface IHttpState<T = any> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  loaded: boolean;
  status: number | null;
}
```

### Использование
```typescript
import { useHttp } from './composables/useHttp';

const { state, request, get, post, put, del, patch, reset } = useHttp();

// Пример использования POST-запроса
await post('/api/users', {
  body: {
    name: 'John Doe',
    email: 'john@example.com'
  }
});

// Или использовать общий метод
await request({
  url: '/api/users',
  method: 'POST',
  body: {
    name: 'John Doe',
    email: 'john@example.com'
  }
});
```

## Структура проекта
- `composables/` - универсальные composables
- `types/` - типы TypeScript
- `src/scss/` - стили в формате SCSS
- `src/components/` - компоненты Vue

## Пример использования
В проекте есть пример компонента `FormExample.vue`, который демонстрирует использование обоих composables одновременно.

## Установка и запуск
1. Установите зависимости: `npm install`
2. Запустите проект: `npm run dev`
3. Соберите проект: `npm run build`

## Деплой на GitHub Pages
Проект настроен для автоматического деплоя на GitHub Pages с помощью GitHub Actions.
Workflow находится в `.github/workflows/deploy.yml`.

## Стек технологий
- Vue 3 Composition API
- TypeScript
- Vite
- Vue 3 Composables
- SCSS

Проект представляет собой готовое решение для валидации форм и выполнения HTTP-запросов в Vue-приложениях.
