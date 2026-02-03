<template>
  <div class="form-container">
    <h2>Форма регистрации пользователя</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-field">
        <label for="name">Имя:</label>
        <input
          id="name"
          v-model="formData.name"
          @blur="markFieldDirty('name')"
          :class="{ error: !formState.name?.isValid && formState.name?.isDirty }"
          placeholder="Введите ваше имя"
        />
        <div v-if="!formState.name?.isValid && formState.name?.isDirty" class="error-message">
          {{ formState.name?.errors[0] }}
        </div>
      </div>
      
      <div class="form-field">
        <label for="email">Email:</label>
        <input
          id="email"
          v-model="formData.email"
          @blur="markFieldDirty('email')"
          :class="{ error: !formState.email?.isValid && formState.email?.isDirty }"
          placeholder="Введите ваш email"
        />
        <div v-if="!formState.email?.isValid && formState.email?.isDirty" class="error-message">
          {{ formState.email?.errors[0] }}
        </div>
      </div>
      
      <div class="form-field">
        <label for="password">Пароль:</label>
        <input
          id="password"
          v-model="formData.password"
          type="password"
          @blur="markFieldDirty('password')"
          :class="{ error: !formState.password?.isValid && formState.password?.isDirty }"
          placeholder="Введите пароль"
        />
        <div v-if="!formState.password?.isValid && formState.password?.isDirty" class="error-message">
          {{ formState.password?.errors[0] }}
        </div>
      </div>
      
      <div class="form-field">
        <label for="confirmPassword">Подтвердите пароль:</label>
        <input
          id="confirmPassword"
          v-model="formData.confirmPassword"
          type="password"
          @blur="markFieldDirty('confirmPassword')"
          :class="{ error: !formState.confirmPassword?.isValid && formState.confirmPassword?.isDirty }"
          placeholder="Подтвердите пароль"
        />
        <div v-if="!formState.confirmPassword?.isValid && formState.confirmPassword?.isDirty" class="error-message">
          {{ formState.confirmPassword?.errors[0] }}
        </div>
      </div>
      
      <div class="form-field">
        <label for="age">Возраст:</label>
        <input
          id="age"
          v-model.number="formData.age"
          type="number"
          @blur="markFieldDirty('age')"
          :class="{ error: !formState.age?.isValid && formState.age?.isDirty }"
          placeholder="Введите возраст"
        />
        <div v-if="!formState.age?.isValid && formState.age?.isDirty" class="error-message">
          {{ formState.age?.errors[0] }}
        </div>
      </div>
      
      <div class="form-actions">
        <button type="submit" :disabled="!isFormValid || httpState.loading">Отправить</button>
        <button type="button" @click="handleReset">Сбросить</button>
      </div>
    </form>
    
    <div v-if="httpState.loading" class="loading">Отправка данных...</div>
    
    <div v-if="httpState.error" class="error-message">
      Ошибка: {{ httpState.error.message }}
    </div>
    
    <div v-if="httpState.loaded && httpState.data" class="success-message">
      Данные успешно отправлены: {{ JSON.stringify(httpState.data) }}
    </div>
    
    <div class="form-status">
      <p>Статус формы: {{ isFormValid ? 'Допустимая' : 'Недопустимая' }}</p>
      <p>Количество ошибок: 0</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useFormValidation } from '@composables/useFormValidation';
import { useHttp } from '@composables/useHttp';
import type { IFormValidationConfig } from '@/interfaces/validation/IFormValidationConfig';

const initialFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  age: 0
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
  },
  password: {
    rules: [
      {
        validate: (value: string) => !!value,
        message: 'Пароль обязателен для заполнения'
      },
      {
        validate: (value: string) => value.length >= 6,
        message: 'Пароль должен содержать не менее 6 символов'
      },
      {
        validate: (value: string) => /[A-Z]/.test(value),
        message: 'Пароль должен содержать хотя бы одну заглавную букву'
      },
      {
        validate: (value: string) => /\d/.test(value),
        message: 'Пароль должен содержать хотя бы одну цифру'
      }
    ]
  },
  confirmPassword: {
    rules: [
      {
        validate: (value: string) => value === (formState.password?.value || ''),
        message: 'Пароли не совпадают'
      }
    ]
  },
  age: {
    rules: [
      {
        validate: (value: number) => value > 0,
        message: 'Возраст должен быть больше 0'
      },
      {
        validate: (value: number) => value <= 120,
        message: 'Возраст должен быть не более 120 лет'
      }
    ]
  }
} as IFormValidationConfig<typeof initialFormData>;

const {
  formState,
  isFormValid,
  validateAll,
  markFieldDirty,
  updateFieldValue,
  resetForm
} = useFormValidation(initialFormData, validationRules);

const formData = reactive({ ...initialFormData });

Object.keys(initialFormData).forEach(key => {
  const fieldKey = key as keyof typeof initialFormData;
  Object.defineProperty(formData, fieldKey, {
    get() {
      return formState[fieldKey]?.value ?? initialFormData[fieldKey];
    },
    set(newValue) {
      updateFieldValue(fieldKey, newValue);
    },
    enumerable: true,
    configurable: true
  });
});

const { state: httpState, post } = useHttp();

const handleSubmit = async () => {
  const validationResult = validateAll();
  
  if (validationResult.isValid) {
    await post('/api/users', {
      body: {
        name: formState.name?.value || '',
        email: formState.email?.value || '',
        password: formState.password?.value || '',
        age: formState.age?.value || 0
      }
    });
  }
};

const handleReset = () => {
  resetForm();

  httpState.data = null;
  httpState.error = null;
  httpState.loaded = false;
};

defineExpose({
  formData,
  formState,
  isFormValid,
  handleSubmit,
  markFieldDirty
});
</script>
