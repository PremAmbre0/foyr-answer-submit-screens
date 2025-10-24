import { defineStore } from 'pinia';
import { fetchQuestionnaireById, addAnswer, lockQuestionnaire, requestUnlock } from '@/network/project.service';

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
      const id = questionnaireId || '68fb5ef6041c7774ba03e3c6'; //demo
      // const id = questionnaireId || '68f77abbd2dceb8327c04199'; //play around

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
              .map(q => {
                // If answer exists, ensure it has all properties
                // If answer doesn't exist, create default structure
                const answer = q.answer ? {
                  response: q.answer.response || '',
                  rating: q.answer.rating || null,
                  selectedOptions: q.answer.selectedOptions || [],
                  referenceImagesByCustomer: q.answer.referenceImagesByCustomer || []
                } : {
                  response: '',
                  rating: null,
                  selectedOptions: [],
                  referenceImagesByCustomer: []
                };

                return {
                  ...q,
                  answer
                };
              })
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
        (q) => q.answer?.response && q.answer.response.trim() !== ''
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
      try {
        // Check if question was already answered (need override)
        const question = this.questionnaireData.questions.find(q => q._id === questionId);
        const wasAnswered = question?.answer?.response && question.answer.response.trim() !== '';

        // Prepare clean answer object (only response and referenceImagesByCustomer)
        const cleanAnswer = {
          response: answer.response || '',
          referenceImagesByCustomer: answer.referenceImagesByCustomer || [],
        };

        const payload = {
          questionnaireId: this.questionnaireData._id,
          questionId,
          answer: cleanAnswer,
        };

        // Add canOverride if answer already exists
        if (wasAnswered) {
          payload.canOverride = true;
        }

        console.log('[API CALL] Submitting answer:', payload);

        const response = await addAnswer(payload);

        console.log('[API CALL] Answer submitted successfully:', response);

        // Check if this is the last question
        const isLastQuestion = this.currentQuestionIndex === this.questionnaireData.questions.length - 1;

        // If last question, lock the questionnaire
        if (isLastQuestion) {
          try {
            console.log('[API CALL] Locking questionnaire...');
            await lockQuestionnaire(this.questionnaireData._id);
            console.log('[API CALL] Questionnaire locked successfully');

            // Update local state to reflect locked status
            this.questionnaireData.isLocked = true;
          } catch (lockError) {
            console.error('[API ERROR] Failed to lock questionnaire:', lockError);
            // Don't throw - answer was saved, just log the lock error
          }
        }

        return {
          success: true,
          completionPercentage,
          data: response?.data,
        };
      } catch (error) {
        console.error('[API ERROR] Failed to submit answer:', error);
        throw error;
      }
    },
    async requestEditAccess() {
      if (!this.questionnaireData?._id) {
        console.error('[ERROR] No questionnaire ID available');
        return { success: false, error: 'No questionnaire loaded' };
      }

      try {
        const response = await requestUnlock(this.questionnaireData._id);

        console.log('[API CALL] Unlock requested successfully:', response);

        return {
          success: true,
          data: response?.data,
        };
      } catch (error) {
        console.error('[API ERROR] Failed to request unlock:', error);
        return {
          success: false,
          error: error.message || 'Failed to request unlock',
        };
      }
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
