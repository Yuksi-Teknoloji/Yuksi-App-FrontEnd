import { API_BASE_URL } from '../constants/api';

const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), ms));

async function request(path, { method = 'GET', headers = {}, body, timeoutMs = 15000 } = {}) {
  const url = `${API_BASE_URL}${path}`;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await Promise.race([
      fetch(url, {
        method,
        headers: { ...DEFAULT_HEADERS, ...headers },
        body,
        signal: controller.signal,
      }),
      timeout(timeoutMs),
    ]);

    clearTimeout(id);

    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      let message = 'Request failed';
      if (isJson) {
        // Try multiple common error message fields
        message = data?.message || data?.error || data?.errorMessage || data?.msg || 'Request failed';
        // Handle validation errors array
        if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          message = data.errors.map(e => e.message || e.msg || e).join(', ');
        }
      } else if (typeof data === 'string' && data.trim()) {
        message = data;
      }
      
      const error = new Error(message);
      error.status = res.status;
      error.data = data;
      throw error;
    }
    console.log('API Response Data:', data);

    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request aborted');
    }
    throw err;
  }
}

export const apiClient = {
  get: (path, options = {}) => request(path, { ...options, method: 'GET' }),
  post: (path, json, options = {}) => request(path, { ...options, method: 'POST', body: JSON.stringify(json) }),
  put: (path, json, options = {}) => request(path, { ...options, method: 'PUT', body: JSON.stringify(json) }),
  patch: (path, json, options = {}) => request(path, { ...options, method: 'PATCH', body: JSON.stringify(json) }),
  del: (path, options = {}) => request(path, { ...options, method: 'DELETE' }),
};
