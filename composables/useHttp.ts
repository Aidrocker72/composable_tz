import { reactive } from 'vue';
import type { IHttpRequestConfig } from '@/interfaces/http/IHttpRequestConfig';
import type { IHttpResponse } from '@/interfaces/http/IHttpResponse';
import type { IHttpState } from '@/interfaces/http/IHttpState';

export function useHttp<T = any>() {
  const state = reactive<IHttpState<T>>({
    data: null,
    error: null,
    loading: false,
    loaded: false,
    status: null
  });

  const request = async (config: IHttpRequestConfig): Promise<IHttpResponse<T> | null> => {
    state.loading = true;
    state.error = null;
    state.loaded = false;
    state.status = null;

    try {
      let url = config.url;
      if (config.params) {
        const queryParams = new URLSearchParams();
        Object.entries(config.params).forEach(([key, value]) => {
          queryParams.append(key, String(value));
        });
        const separator = url.includes('?') ? '&' : '?';
        url += separator + queryParams.toString();
      }

      const options: RequestInit = {
        method: config.method,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        }
      };

      if (config.body && (config.method === 'POST' || config.method === 'PUT' || config.method === 'PATCH')) {
        options.body = typeof config.body === 'string' ? config.body : JSON.stringify(config.body);
      }

      const response = await fetch(url, options);

      state.status = response.status;

      let responseData: T | null = null;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json() as T;
      } else {
        responseData = await response.text() as unknown as T;
      }

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      }

      Object.assign(state, {
        data: responseData,
        loaded: true,
        loading: false
      });

      return {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      };
    } catch (error: any) {
      Object.assign(state, {
        error: error,
        loading: false
      });
      
      console.error('HTTP request failed:', error);
      return null;
    }
  };

  const get = async (url: string, config?: Omit<IHttpRequestConfig, 'url' | 'method'>) => {
    return request({
      url,
      method: 'GET',
      ...config
    });
  };

  const post = async (url: string, config?: Omit<IHttpRequestConfig, 'url' | 'method'>) => {
    return request({
      url,
      method: 'POST',
      ...config
    });
  };

  const put = async (url: string, config?: Omit<IHttpRequestConfig, 'url' | 'method'>) => {
    return request({
      url,
      method: 'PUT',
      ...config
    });
  };

  const del = async (url: string, config?: Omit<IHttpRequestConfig, 'url' | 'method'>) => {
    return request({
      url,
      method: 'DELETE',
      ...config
    });
  };

  const patch = async (url: string, config?: Omit<IHttpRequestConfig, 'url' | 'method'>) => {
    return request({
      url,
      method: 'PATCH',
      ...config
    });
  };

  const reset = () => {
    state.data = null;
    state.error = null;
    state.loading = false;
    state.loaded = false;
    state.status = null;
  };

  return {
    state,
    request,
    get,
    post,
    put,
    del,
    patch,
    reset
  };
}