import { defineStore } from 'pinia';

export const useUIStates = defineStore('uiStates', {
  state: () => ({
    selectedMode: 'text', // 'text' or 'conversation'
  }),
  actions: {
    setMode(mode) {
      if (mode === 'text' || mode === 'conversation') {
        this.selectedMode = mode;
        console.log('[MODE] Selected mode:', mode);
      }
    },
  },
  getters: {
    isTextMode: (state) => state.selectedMode === 'text',
    isConversationMode: (state) => state.selectedMode === 'conversation',
  },
});
