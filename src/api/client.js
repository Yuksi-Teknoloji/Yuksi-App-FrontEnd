import { API_BASE_URL } from '../constants/api';
import { getItem } from '../utils/storage';

const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), ms));

/**
 * Get authentication token from storage
 * @returns {Promise<string|null>}
 */
async function getAuthToken() {
  try {
    const token = await getItem('userToken');
    console.log('🔑 Retrieved token from storage:', token ? `${token.substring(0, 20)}...` : 'null');
    return token;
  } catch (error) {
    console.error('❌ Failed to get auth token:', error);
    return null;
  }
}

async function request(path, { method = 'GET', headers = {}, body, timeoutMs = 15000, skipAuth = false } = {}) {
  const url = `${API_BASE_URL}${path}`;

  // Get auth token and add to headers if available
  const authHeaders = { ...DEFAULT_HEADERS };
  if (!skipAuth) {
    const token = await getAuthToken();
    if (token) {
      authHeaders['Authorization'] = `Bearer ${token}`;
      console.log('✅ Added Authorization header to request:', method, path);
    } else {
      console.warn('⚠️ No token found for authenticated request:', method, path);
    }
  } else {
    console.log('🔓 Skipping auth for:', method, path);
  }

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await Promise.race([
      fetch(url, {
        method,
        headers: { ...authHeaders, ...headers },
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

/**
 * Upload file using FormData
 * @param {string} path - API endpoint path
 * @param {FormData} formData - FormData object with files
 * @param {Object} options - Additional options
 * @returns {Promise<any>}
 */
async function uploadFile(path, formData, { timeoutMs = 30000, skipAuth = false } = {}) {
  const url = `${API_BASE_URL}${path}`;

  // Get auth token
  const authHeaders = {};
  if (!skipAuth) {
    const token = await getAuthToken();
    if (token) {
      authHeaders['Authorization'] = `Bearer ${token}`;
      console.log('✅ Added Authorization header to upload:', path);
    } else {
      console.warn('⚠️ No token found for authenticated upload:', path);
    }
  } else {
    console.log('🔓 Skipping auth for upload:', path);
  }

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await Promise.race([
      fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          // Don't set Content-Type for FormData - browser will set it with boundary
          ...authHeaders,
        },
        body: formData,
        signal: controller.signal,
      }),
      timeout(timeoutMs),
    ]);

    clearTimeout(id);

    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      console.error('❌ Upload failed with status:', res.status);
      console.error('❌ Response data:', data);

      let message = 'Upload failed';
      if (isJson) {
        message = data?.message || data?.error || data?.errorMessage || data?.msg || 'Upload failed';
        if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          message = data.errors.map(e => e.message || e.msg || e).join(', ');
        }
      } else if (typeof data === 'string' && data.trim()) {
        message = data;
      }

      console.error('❌ Error message:', message);

      const error = new Error(message);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    console.log('Upload Response:', data);
    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Upload aborted');
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
  upload: uploadFile,
};
