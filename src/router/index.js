import { createRouter, createWebHashHistory } from 'vue-router';
import WelcomeWrapper from '../views/WelcomeWrapper.vue';
import QuestionWrapper from '../views/QuestionWrapper.vue';
import EndWrapper from '../views/EndWrapper.vue';
import { useQuestionnaire } from '@/stores/questionnaire.store';

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeWrapper,
    },
    {
      path: '/question',
      name: 'question',
      component: QuestionWrapper,
    },
    {
      path: '/end',
      name: 'end',
      component: EndWrapper,
    },
  ],
});

// Navigation guard to initialize questionnaire
router.beforeEach(async (to, from, next) => {
  const questionnaireStore = useQuestionnaire();

  // If not initialized, initialize the questionnaire
  if (!questionnaireStore.isInitialized) {
    // Get questionnaire ID and mode from query params
    const questionnaireId = to.query.id || null;
    const mode = to.query.mode || null;
    const isPreviewMode = mode === 'preview';

    try {
      // Initialize questionnaire with preview mode flag
      const success = await questionnaireStore.initializeQuestionnaire(questionnaireId, isPreviewMode);
      
      if (success) {
        next();
      } else {
        // Handle initialization failure
        console.error('Failed to initialize questionnaire');
        next();
      }
    } catch (error) {
      console.error('Error initializing questionnaire:', error);
      next();
    }
  } else {
    next();
  }
});

export default router;
