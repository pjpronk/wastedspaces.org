export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    const BASE_URL = config.public.BACKEND_URL;

    const apiFetch = async (endpoint: string, params: Record<string, string> = {}, options: RequestInit = {}) => {
      try {
        // Construct query string if params exist
        const queryString = new URLSearchParams(params).toString();
        const url = `${BASE_URL}/${endpoint}${queryString ? `?${queryString}` : ''}`;
    
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
          },
        });
    
        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }
    
        return await response.json();
      } catch (error) {
        console.error("API fetch error:", error);
        throw error;
      }
    };
    
  
    return {
      provide: {
        apiFetch,
      },
    };
  });
  