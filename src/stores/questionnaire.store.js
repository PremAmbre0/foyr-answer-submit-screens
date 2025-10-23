import { defineStore } from 'pinia';
import { fetchQuestionnaireById } from '@/network/project.service';

export const useQuestionnaire = defineStore('questionnaire', {
  state: () => ({
    questionnaireData: null,
    currentQuestionIndex: 0,
    isInitialized: false,
    showProgressBar: false,
    isPreviewMode: false,
  }),
  actions: {
    async initializeQuestionnaire(questionnaireId, isPreviewMode = false) {
      // Set preview mode flag
      this.isPreviewMode = isPreviewMode;
      
      console.log(`[INIT] Questionnaire ID: ${questionnaireId}, Preview Mode: ${isPreviewMode}`);
      
      // Fallback to default ID if none provided
      const id = questionnaireId || '68f88d45c1eb11c1c26560cf';
      
      try {
        // Fetch real questionnaire data from API
        const response = await fetchQuestionnaireById(id);
        
        console.log('[DEBUG] API Response:', response);
        
        // API returns { data: { success, message, data: {...} } }
        const apiData = response?.data?.data;
        
        if (apiData) {
          // Initialize completionPercentage if not present
          const questionnaireData = {
            ...apiData,
            completionPercentage: apiData.completionPercentage || 0,
          };
          
          // Ensure all questions have answer field initialized and sort by order
          if (questionnaireData.questions && Array.isArray(questionnaireData.questions)) {
            questionnaireData.questions = questionnaireData.questions
              .map(q => ({
                ...q,
                answer: q.answer || null,
              }))
              .sort((a, b) => (a.order || 0) - (b.order || 0));
            
            console.log('[DEBUG] Sorted questions:', questionnaireData.questions.map(q => ({ order: q.order, question: q.question })));
          }
          
          this.questionnaireData = questionnaireData;
          this.isInitialized = true;
          console.log('[INIT] Questionnaire loaded successfully');
          console.log('[DEBUG] Total questions:', questionnaireData.questions?.length);
          return true;
        } else {
          console.error('[INIT] Invalid response format. Expected response.data.data');
          console.error('[DEBUG] Received:', response);
          return false;
        }
      } catch (error) {
        console.error('[INIT] Failed to fetch questionnaire:', error);
        return false;
      }
    },
    setCurrentQuestionIndex(index) {
      this.currentQuestionIndex = index;
    },
    setShowProgressBar(show) {
      this.showProgressBar = show;
    },
    nextQuestion() {
      if (this.currentQuestionIndex < this.questionnaireData.questions.length - 1) {
        this.currentQuestionIndex++;
        return true;
      }
      return false;
    },
    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
        return true;
      }
      return false;
    },
    async submitAnswer(questionId, answer) {
      // Answer is already updated via v-model binding
      // Just calculate completion percentage based on answered questions
      const answeredQuestions = this.questionnaireData.questions.filter(
        (q) => q.answer !== null && q.answer !== ''
      ).length;
      
      const totalQuestions = this.questionnaireData.questions.length;
      const completionPercentage = Math.round((answeredQuestions / totalQuestions) * 100);
      
      // Update the questionnaire data with new completion percentage
      this.questionnaireData.completionPercentage = completionPercentage;
      
      // In preview mode, skip API call and just update store
      if (this.isPreviewMode) {
        console.log('[PREVIEW MODE] Answer not sent to API, stored locally only');
        return Promise.resolve({
          success: true,
          completionPercentage,
        });
      }
      
      // In normal mode, make API call to persist answer
      // TODO: Replace with actual API call when backend is ready
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('[API CALL] Submitting answer to backend:', { questionId, answer });
          // Mock API response
          resolve({
            success: true,
            completionPercentage,
          });
        }, 300);
      });
    },
  },
  getters: {
    currentQuestion: (state) => {
      if (!state.questionnaireData || !state.questionnaireData.questions) {
        return null;
      }
      return state.questionnaireData.questions[state.currentQuestionIndex];
    },
    progressPercentage: (state) => {
      // Use completionPercentage from API data
      return state.questionnaireData?.completionPercentage || 0;
    },
    totalQuestions: (state) => {
      return state.questionnaireData?.questions?.length || 0;
    },
  },
});
