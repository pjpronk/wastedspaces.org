export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    const BASE_URL = config.public.BACKEND_URL;

    const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
      try {
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
          },
        });
  
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('API Fetch Error:', error);
        throw error;
      }
    };
  
    return {
      provide: {
        apiFetch,
      },
    };
  });
  