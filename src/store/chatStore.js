import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {sendChatMessage} from '../api/chatApi';

const CHAT_SESSION_KEY = '@chat_session_id';

// Helper functions for sessionId management
const getSessionId = async () => {
  try {
    return await AsyncStorage.getItem(CHAT_SESSION_KEY);
  } catch (error) {
    console.warn('Failed to get sessionId:', error);
    return null;
  }
};

const saveSessionId = async sessionId => {
  try {
    await AsyncStorage.setItem(CHAT_SESSION_KEY, sessionId);
  } catch (error) {
    console.warn('Failed to save sessionId:', error);
  }
};

const useChatStore = create(set => ({
  messages: [],
  inputText: '',
  suggestions: ['Kargom nerede?', 'Teslimat süresi?', 'Ücret nedir?'],
  showSuggestions: true,
  isLoading: false,
  error: null,

  setInputText: text => set({inputText: text}),

  sendMessage: async text => {
    const trimmed = (text || '').trim();
    if (!trimmed) return;

    // Add user message immediately (optimistic update)
    const userMsg = {id: `m-${Date.now()}`, text: trimmed, side: 'user'};
    set(state => ({
      messages: [...state.messages, userMsg],
      inputText: '',
      showSuggestions: false,
      isLoading: true,
      error: null,
    }));

    try {
      // Get existing sessionId
      const sessionId = await getSessionId();

      // Call API
      const response = await sendChatMessage(trimmed, sessionId);

      // Save new sessionId if provided
      if (response.data?.sessionId) {
        await saveSessionId(response.data.sessionId);
      }

      // Add bot message
      const botMsg = {
        id: `b-${Date.now()}`,
        text: response.data?.response || 'Yanıt alınamadı',
        side: 'bot',
      };

      set(state => ({
        messages: [...state.messages, botMsg],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Chat API error:', error);

      // Add error message as bot response
      const errorMsg = {
        id: `b-${Date.now()}`,
        text: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        side: 'bot',
      };

      set(state => ({
        messages: [...state.messages, errorMsg],
        isLoading: false,
        error: error.message || 'Bir hata oluştu',
      }));
    }
  },

  sendSuggestion: async text => {
    // Add user message immediately
    const userMsg = {id: `m-${Date.now()}`, text, side: 'user'};
    set(state => ({
      messages: [...state.messages, userMsg],
      showSuggestions: false,
      isLoading: true,
      error: null,
    }));

    try {
      // Get existing sessionId
      const sessionId = await getSessionId();

      // Call API
      const response = await sendChatMessage(text, sessionId);

      // Save new sessionId if provided
      if (response.data?.sessionId) {
        await saveSessionId(response.data.sessionId);
      }

      // Add bot message
      const botMsg = {
        id: `b-${Date.now()}`,
        text: response.data?.response || 'Yanıt alınamadı',
        side: 'bot',
      };

      set(state => ({
        messages: [...state.messages, botMsg],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Chat API error:', error);

      // Add error message as bot response
      const errorMsg = {
        id: `b-${Date.now()}`,
        text: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        side: 'bot',
      };

      set(state => ({
        messages: [...state.messages, errorMsg],
        isLoading: false,
        error: error.message || 'Bir hata oluştu',
      }));
    }
  },

  clearError: () => set({error: null}),

  clear: async () => {
    // Clear sessionId when clearing chat
    try {
      await AsyncStorage.removeItem(CHAT_SESSION_KEY);
    } catch (error) {
      console.warn('Failed to clear sessionId:', error);
    }
    set({messages: [], inputText: '', showSuggestions: true, error: null});
  },
}));

export default useChatStore;
