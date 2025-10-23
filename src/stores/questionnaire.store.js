import { defineStore } from 'pinia';

export const useQuestionnaire = defineStore('questionnaire', {
  state: () => ({
    questionnaireData: null,
    currentQuestionIndex: 0,
    isInitialized: false,
    showProgressBar: false,
  }),
  actions: {
    async initializeQuestionnaire(questionnaireId) {
      // Mock API call - returns true for now
      return new Promise((resolve) => {
        setTimeout(() => {
          // Mock questionnaire data
          const mockData = {
            _id: questionnaireId || '68f77abbd2dceb8327c04199',
            title: 'Questionnaire',
            themeColor: '#000000',
            completionPercentage: 0,
            welcomeScreen: {
              title: 'Welcome to Your Kitchen Vision Questionnaire',
              description: 'Tell us a bit about your vision for your dream kitchen.',
              logoUrl: 'https://example.com/logo.png',
            },
            questions: [
              {
                _id: '68f77bb0d2dceb8327c041a5',
                question: "What's inspiring this kitchen renovation?",
                description: 'e.g., need more space, want a modern upgrade, better lighting, etc.',
                type: 'SHORT_TEXT',
                required: true,
                order: 0,
                answer: null,
              },
              {
                _id: '68f77bb0d2dceb8327c041a6',
                question: 'What is your preferred kitchen style?',
                description: 'Modern, Traditional, Rustic, Contemporary, etc.',
                type: 'SHORT_TEXT',
                required: true,
                order: 1,
                answer: null,
              },
              {
                _id: '68f77bb0d2dceb8327c041a7',
                question: 'What is your budget range for this project?',
                description: 'Please provide an approximate range',
                type: 'SHORT_TEXT',
                required: true,
                order: 2,
                answer: null,
              },
              {
                _id: '68f77bb0d2dceb8327c041a8',
                question: 'How many people typically use your kitchen?',
                description: 'This helps us understand space requirements',
                type: 'SHORT_TEXT',
                required: false,
                order: 3,
                answer: null,
              },
              {
                _id: '68f77bb0d2dceb8327c041a9',
                question: 'What appliances do you want to include?',
                description: 'e.g., refrigerator, oven, microwave, dishwasher, etc.',
                type: 'LONG_TEXT',
                required: true,
                order: 4,
                answer: null,
              },
              {
                _id: '68f77bb0d2dceb8327c041aa',
                question: 'Any specific features or requirements?',
                description: 'Island, breakfast bar, pantry, special storage, etc.',
                type: 'LONG_TEXT',
                required: false,
                order: 5,
                answer: null,
              },
            ],
            endScreen: {
              title: 'Thank you for sharing your vision!',
              bodyText: 'Our design team will review your feedback and reach out soon with a proposal.',
            },
          };

          this.questionnaireData = mockData;
          this.isInitialized = true;
          resolve(true);
        }, 100);
      });
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
      
      // Mock API call
      return new Promise((resolve) => {
        setTimeout(() => {
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
