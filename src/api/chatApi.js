import { apiClient } from './client';
import { ENDPOINTS } from '../constants/api';

/**
 * Send message to chatbot
 * @param {string} message - User message
 * @param {string} [sessionId] - Optional session ID
 * @returns {Promise<{message: string, sessionId: string}>}
 */
const sendChatMessage = async (message, sessionId = null) => {
  const payload = {
    message,
  };

  // Only include sessionId if it exists
  if (sessionId) {
    payload.sessionId = sessionId;
  }

  return await apiClient.post(ENDPOINTS.cargoChat, payload);
};

export const chatApi = {
  sendMessage: sendChatMessage,
};
