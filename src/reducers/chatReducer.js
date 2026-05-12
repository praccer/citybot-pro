export const initialChatState = {
  messages: [
    {
      id: 'welcome',
      role: 'bot',
      text: 'Bonjour ! Je suis NOVA 🌆, votre assistant citoyen NeoVille. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date().toISOString(),
    },
  ],
  isLoading: false,
  error: null,
};

export function chatReducer(state, action) {
  switch (action.type) {
    case 'SEND_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: `user-${Date.now()}`,
            role: 'user',
            text: action.payload,
            timestamp: new Date().toISOString(),
          },
        ],
        isLoading: true,
        error: null,
      };
    case 'RECEIVE_RESPONSE':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: `bot-${Date.now()}`,
            role: 'bot',
            text: action.payload,
            timestamp: new Date().toISOString(),
          },
        ],
        isLoading: false,
      };
    case 'SET_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}
