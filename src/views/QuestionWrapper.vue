<script setup>
import { computed, onMounted, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useQuestionnaire } from '@/stores/questionnaire.store';
import { storeToRefs } from 'pinia';
import ProgressBar from '@/components/sharedComponents/ProgressBar.vue';
import ModeToggle from '@/components/sharedComponents/ModeToggle.vue';

const router = useRouter();
const questionnaireStore = useQuestionnaire();
const { currentQuestion, progressPercentage, currentQuestionIndex, totalQuestions, isPreviewMode } = storeToRefs(questionnaireStore);
const appImages = inject("appImages")
const handleNext = async () => {
  console.log('[CTA] Next button clicked');

  const answer = currentQuestion.value.answer;

  // In preview mode, skip validation and allow navigation without answers
  if (!isPreviewMode.value) {
    // Check if answer.response exists and has content
    if (!answer?.response || !answer.response.trim()) {
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

const handleImageUpload = () => {
  console.log('[ACTION] Image upload clicked');
  // TODO: Implement image upload
};

const handleVoiceInput = () => {
  console.log('[ACTION] Voice input clicked');
  // TODO: Implement voice input
};

onMounted(() => {
  questionnaireStore.setShowProgressBar(true);
});
</script>

<template>
  <div class="question-wrapper" v-if="currentQuestion">
    <ProgressBar />

    <!-- Mode Toggle Icons - Desktop (Top Left) -->
    <div class="mode-toggle-desktop">
      <ModeToggle :showText="false" />
    </div>

    <div class="content">
      <!-- Mode Toggle Icons - Mobile (Top Middle) -->
      <div class="mode-toggle-mobile">
        <ModeToggle :showText="false" />
      </div>

      <div class="question-block">
        <div class="question-info">
          <div class="question-number">{{ currentQuestionIndex + 1 }}.</div>
          <div class="question-text">
            <h2>{{ currentQuestion?.question }}</h2>
          </div>
          <div class="empty-space"></div>
          <div class="description" v-if="currentQuestion?.description">
            {{ currentQuestion.description }}
          </div>
        </div>
        <div class="dynamic-image-grid">
          <img src="https://picsum.photos/200/300" alt="Image 1">
          <img src="https://picsum.photos/200/300" alt="Image 2">
          <img src="https://picsum.photos/200/300" alt="Image 3">
          <img src="https://picsum.photos/200/300" alt="Image 4">
          <img src="https://picsum.photos/200/300" alt="Image 5">
        </div>



        <div class="answer-section">
          <div class="answer-input">
            <textarea v-if="currentQuestion?.type === 'LONG_TEXT'" v-model="currentQuestion.answer.response"
              placeholder="Type your answer here" rows="4"></textarea>
            <input v-else-if="currentQuestion" v-model="currentQuestion.answer.response" type="text"
              placeholder="Type your answer here" />
          </div>

          <!-- Mobile: Action icons below input -->
          <div class="action-icons action-icons-mobile">
            <div class="icon-btn iwpar" @click="handleImageUpload" title="Add images">
              <img :src="appImages['paperclip.svg']" alt="">
            </div>
            <div class="icon-btn iwpar" @click="handleVoiceInput" title="Voice input">
              <img :src="appImages['microphone.svg']" alt="">
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop & Mobile: Navigation -->
      <div class="bottom-section">
        <div class="navigation">
          <button v-if="currentQuestionIndex > 0" @click="handlePrevious" class="back-btn">
            Back
          </button>
          <button @click="handleNext" class="next-btn">
            {{ currentQuestionIndex < totalQuestions - 1 ? 'Next' : 'Finish' }} </button>
        </div>

        <!-- Desktop: Action icons on right -->
        <div class="action-icons action-icons-desktop">
          <div class="icon-btn iwpar" @click="handleImageUpload" title="Add images">
            <img :src="appImages['paperclip.svg']" alt="">
          </div>
          <div class="icon-btn iwpar" @click="handleVoiceInput" title="Voice input">
            <img :src="appImages['microphone.svg']" alt="">
          </div>
        </div>
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

  .mode-toggle-desktop {
    position: absolute;
    top: 1.5rem;
    left: 2rem;
    display: flex;
    gap: 0.5rem;

    @include tablet {
      display: none;
    }
  }

  .mode-toggle-mobile {
    display: none;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 2rem;

    @include tablet {
      display: flex;
    }
  }

  .content {
    flex: 1;
    padding: 3rem 2rem;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    @include tablet {
      padding: 2rem 1.5rem;
      max-width: 100%;
      min-height: 0;
      justify-content: space-between;
    }

    .question-block {
      @include tablet {
        margin: auto 0;
        display: flex;
        flex-direction: column;
      }
    }

    .answer-section {
      margin-bottom: 3rem;

      @include tablet {
        margin-bottom: 0;
        display: flex;
        flex-direction: column;
      }

      .answer-input {
        margin-bottom: 1rem;

        @include tablet {
          margin-bottom: 1.5rem;
        }

        input,
        textarea {
          width: 100%;
          padding: 0.75rem 0;
          font-size: 0.875rem;

          font-weight: 400;
          border: none;
          border-bottom: 1px solid $border-gray-300;
          color: $color-gray-900;
          transition: border-color 0.2s ease;
          background: transparent;

          &::placeholder {
            color: $color-gray-300;
            font-style: italic;
          }

          &:focus {
            outline: none;
            border-bottom-color: $color-gray-900;
          }
        }

        textarea {
          resize: vertical;
          min-height: 6.25rem;
        }
      }

      .action-icons-mobile {
        display: none;

        @include tablet {
          display: flex;
        }
      }
    }

    .bottom-section {
      display: flex;
      justify-content: space-between;
      align-items: center;

      @include tablet {
        flex-direction: column-reverse;
        gap: 0.75rem;
        margin-top: auto;
        flex: 0 0 auto;
        padding-top: 2rem;
      }
    }

    .question-info {
      display: grid;
      grid-template-columns: 0.875rem 1fr;
      grid-template-rows: auto auto;
      gap: 0.5rem 0.5rem;
      margin-bottom: 2rem;

      @include tablet {
        margin-bottom: 1rem;
      }

      .question-number {
        grid-column: 1;
        grid-row: 1;
        color: $color-gray-900;
        font-size: 1rem;
        font-weight: 700;
        display: flex;
        align-items: end;

        @include tablet {
          font-size: 1.25rem;
        }
      }

      .question-text {
        grid-column: 2;
        grid-row: 1;

        h2 {
          color: $color-gray-900;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;

          @include tablet {
            font-size: 1.25rem;
          }
        }
      }

      .empty-space {
        grid-column: 1;
        grid-row: 2;
        height: 1rem;
      }

      .description {
        grid-column: 2;
        grid-row: 2;
        color: $color-gray-400;
        font-size: 1rem;
        font-style: italic;
        font-weight: 400;
        margin: 0;
      }
    }

    .dynamic-image-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(5.9375rem, 8.75rem));
      gap: .25rem .5rem;

      & img {
        border-radius: .5rem;
        width: 100%;
        min-height: .5rem;
        max-height: 7.5rem;
        object-fit: cover;
        display: block;
        cursor: pointer;
      }
    }

    .navigation {
      display: flex;
      gap: 1rem;

      @include tablet {
        width: 100%;
        flex-direction: column-reverse;
        gap: 0.75rem;
      }

      .back-btn {
        @include button-secondary;
        border: none;

        @include tablet {
          width: 100%;
        }
      }

      .next-btn {
        @include button-primary;
        padding: 0.75rem 2rem;

        @include tablet {
          width: 100%;
        }
      }
    }

    .action-icons {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;

      .icon-btn {
        display: flex;
        width: 2rem;
        height: 2rem;
        justify-content: center;
        padding: .5rem;
        align-items: center;
        gap: .25rem;
        border-radius: 1.125rem;
        background: #F9FAFB;
        cursor: pointer;

        &:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #1e293b;
        }

        &:active {
          transform: scale(0.95);
        }

        svg {
          width: 1.25rem;
          height: 1.25rem;
        }
      }
    }

    .action-icons-desktop {
      @include tablet {
        display: none;
      }
    }

  }
}
</style>
