import {apiClient} from './client';

/**
 * Send message to chatbot
 * @param {string} message - User message
 * @param {string} [sessionId] - Optional session ID
 * @returns {Promise<{message: string, sessionId: string}>}
 */
export const sendChatMessage = async (message, sessionId = null) => {
  const payload = {
    message,
  };

  // Only include sessionId if it exists
  if (sessionId) {
    payload.sessionId = sessionId;
  }

  return await apiClient.post('/api/cargo/chat', payload);
};
