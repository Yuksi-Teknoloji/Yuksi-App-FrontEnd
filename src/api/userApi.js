import { apiClient } from './client';
import { ENDPOINTS } from '../constants/api';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>}
 */
const register = async ({ email, password, phone, first_name, last_name }) => {
  // Skip auth for registration (no token yet)
  return apiClient.post(
    ENDPOINTS.register,
    {
      email,
      password,
      phone,
      first_name,
      last_name,
    },
    { skipAuth: true }
  );
};

/**
 * Login user
 * @param {Object} credentials - User credentials
 * @returns {Promise<Object>}
 */
const login = async ({ email, password }) => {
  // Skip auth for login (no token yet)
  return apiClient.post(
    ENDPOINTS.login,
    {
      email,
      password,
    },
    { skipAuth: true }
  );
};

export const userApi = {
  register,
  login,
};
