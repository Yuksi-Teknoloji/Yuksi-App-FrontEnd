import { create } from 'zustand';

const useChatStore = create((set) => ({
  messages: [],
  inputText: '',
  // Default suggestions shown before any message is sent
  suggestions: ['Kargom nerede?', 'Teslimat süresi?', 'Ücret nedir?'],
  showSuggestions: true,

  setInputText: (text) => set({ inputText: text }),

  sendMessage: (text) => set((state) => {
    const trimmed = (text || '').trim();
    if (!trimmed) return {};
    const userMsg = { id: `m-${Date.now()}`, text: trimmed, side: 'user' };
    const botMsg = {
      id: `b-${Date.now()}`,
      text: 'Merhaba! Mesajınızı aldım. Size nasıl yardımcı olabilirim?',
      side: 'bot',
    };
    return {
      messages: [...state.messages, userMsg, botMsg],
      inputText: '',
      showSuggestions: false,
    };
  }),

  sendSuggestion: (text) => set((state) => {
    const userMsg = { id: `m-${Date.now()}`, text, side: 'user' };
    const botMsg = {
      id: `b-${Date.now()}`,
      text: 'Merhaba! Mesajınızı aldım. Size nasıl yardımcı olabilirim?',
      side: 'bot',
    };
    return {
      messages: [...state.messages, userMsg, botMsg],
      showSuggestions: false,
    };
  }),

  clear: () => set({ messages: [], inputText: '', showSuggestions: true }),
}));

export default useChatStore;
