import { apiClient } from './client';
import { ENDPOINTS } from '../constants/api';

export const userApi = {
  register: async ({ email, password, phone, first_name, last_name }) => {
    return apiClient.post(ENDPOINTS.register, {
      email,
      password,
      phone,
      first_name,
      last_name,
    });
  },
};
