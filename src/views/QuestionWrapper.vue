<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuestionnaire } from '@/stores/questionnaire.store';
import { storeToRefs } from 'pinia';
import ProgressBar from '@/components/sharedComponents/ProgressBar.vue';

const router = useRouter();
const questionnaireStore = useQuestionnaire();
const { currentQuestion, progressPercentage, currentQuestionIndex, totalQuestions, isPreviewMode } = storeToRefs(questionnaireStore);

const handleNext = async () => {
  console.log('[CTA] Next button clicked');
  
  const answer = currentQuestion.value.answer;
  
  // In preview mode, skip validation and allow navigation without answers
  if (!isPreviewMode.value) {
    // Check if answer exists
    if (!answer || !answer.trim()) {
      console.log('[VALIDATION] No answer provided');
      alert('Please provide an answer before proceeding.');
      return;
    }
  }

  console.log('[ANSWER]', answer);

  // Submit answer
  await questionnaireStore.submitAnswer(currentQuestion.value._id, answer);
  console.log('[PROGRESS]', progressPercentage.value + '%');
  
  const hasMore = questionnaireStore.nextQuestion();
  if (!hasMore) {
    console.log('[CTA] Moving to end screen');
    router.push({ name: 'end' });
  }
};

const handlePrevious = () => {
  console.log('[CTA] Previous button clicked');
  questionnaireStore.previousQuestion();
};

onMounted(() => {
  questionnaireStore.setShowProgressBar(true);
});
</script>

<template>
  <div class="question-wrapper" v-if="currentQuestion">
    <ProgressBar />

    <div class="content">
      <div class="question-info">
        <p class="question-counter">{{ currentQuestionIndex + 1 }}. </p>
        <h2>{{ currentQuestion?.question }}</h2>
        <p class="description">{{ currentQuestion?.description }}</p>
      </div>

      <div class="answer-input">
        <textarea 
          v-if="currentQuestion?.type === 'LONG_TEXT'"
          v-model="currentQuestion.answer"
          placeholder="Type your answer here"
          rows="4"
        ></textarea>
        <input 
          v-else-if="currentQuestion"
          v-model="currentQuestion.answer"
          type="text"
          placeholder="Type your answer here"
        />
      </div>

      <div class="navigation">
        <button @click="handlePrevious" :disabled="currentQuestionIndex === 0">Previous</button>
        <button @click="handleNext" class="next-btn">
          {{ currentQuestionIndex < totalQuestions - 1 ? 'Next' : 'Finish' }}
        </button>
      </div>

      <div class="debug">
        <h3>Question Object:</h3>
        <pre>{{ JSON.stringify(currentQuestion, null, 2) }}</pre>
        <p><strong>Progress:</strong> {{ progressPercentage }}%</p>
        <p><strong>Question:</strong> {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.question-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  .content {
    flex: 1;
    padding: 3rem 2rem;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;

    .answer-input {
      margin-bottom: 2rem;

      input,
      textarea {
        width: 100%;
        padding: 0.75rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-family: inherit;

        &:focus {
          outline: none;
          border-color: #000;
        }
      }

      textarea {
        resize: vertical;
      }
    }

    .question-info {
      margin-bottom: 2rem;

      .question-counter {
        font-size: 1rem;
        color: #999;
        margin-bottom: 0.5rem;
      }

      h2 {
        font-size: 1.75rem;
        margin-bottom: 1rem;
      }

      .description {
        font-size: 1rem;
        color: #666;
      }
    }

    .navigation {
      display: flex;
      gap: 1rem;
      margin-bottom: 3rem;

      button {
        padding: 0.75rem 2rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        background: #fff;
        border-radius: 4px;
        cursor: pointer;

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        &.next-btn {
          background: #000;
          color: #fff;
          border: none;

          &:hover:not(:disabled) {
            background: #333;
          }
        }

        &:hover:not(:disabled) {
          background: #f5f5f5;
        }
      }
    }

    .debug {
      background: #f5f5f5;
      padding: 1.5rem;
      border-radius: 4px;
      overflow: auto;

      h3 {
        margin-top: 0;
        margin-bottom: 1rem;
      }

      pre {
        margin: 1rem 0;
        font-size: 0.875rem;
        overflow: auto;
      }

      p {
        margin: 0.5rem 0;
      }
    }
  }
}
</style>
