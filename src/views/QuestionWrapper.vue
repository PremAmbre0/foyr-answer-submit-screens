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
    
    <!-- Mode Toggle Icons - Desktop (Top Right) -->
    <div class="mode-toggle-desktop">
      <button class="toggle-icon" title="Text Mode">
        <span>📝</span>
      </button>
      <button class="toggle-icon" title="Conversation Mode" disabled>
        <span>💬</span>
      </button>
    </div>
    
    <div class="content">
      <!-- Mode Toggle Icons - Mobile (Top Middle) -->
      <div class="mode-toggle-mobile">
        <button class="toggle-icon" title="Text Mode">
          <span>📝</span>
        </button>
        <button class="toggle-icon" title="Conversation Mode" disabled>
          <span>💬</span>
        </button>
      </div>
      
      <div class="question-block">
        <div class="question-info">
          <div class="question-header">
            <span class="question-number">{{ currentQuestionIndex + 1 }}.</span>
            <div class="question-text">
              <h2>{{ currentQuestion?.question }}</h2>
              <p class="description" v-if="currentQuestion?.description">
                {{ currentQuestion.description }}
              </p>
            </div>
          </div>
        </div>

        <div class="answer-section">
        <div class="answer-input">
          <textarea 
            v-if="currentQuestion?.type === 'LONG_TEXT'"
            v-model="currentQuestion.answer.response"
            placeholder="Type your answer here"
            rows="4"
          ></textarea>
          <input 
            v-else-if="currentQuestion"
            v-model="currentQuestion.answer.response"
            type="text"
            placeholder="Type your answer here"
          />
        </div>
        
        <!-- Mobile: Action icons below input -->
        <div class="action-icons action-icons-mobile">
          <button class="icon-btn" @click="handleImageUpload" title="Add images">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </button>
          <button class="icon-btn" @click="handleVoiceInput" title="Voice input">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </button>
        </div>
        </div>
      </div>

      <!-- Desktop & Mobile: Navigation -->
      <div class="bottom-section">
        <div class="navigation">
          <button 
            v-if="currentQuestionIndex > 0" 
            @click="handlePrevious" 
            class="back-btn"
          >
            Back
          </button>
          <button @click="handleNext" class="next-btn">
            {{ currentQuestionIndex < totalQuestions - 1 ? 'Next' : 'Finish' }}
          </button>
        </div>
        
        <!-- Desktop: Action icons on right -->
        <div class="action-icons action-icons-desktop">
          <button class="icon-btn" @click="handleImageUpload" title="Add images">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </button>
          <button class="icon-btn" @click="handleVoiceInput" title="Voice input">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </button>
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
  
  .toggle-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    
    span {
      font-size: 1.25rem;
    }
    
    &:hover:not(:disabled) {
      background: #f8fafc;
      border-color: #cbd5e1;
    }
    
    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
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
        
        input, textarea {
          width: 100%;
          padding: 0.75rem 0;
          font-size: 14px;
          font-family: $nunito-font;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
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
          min-height: 100px;
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
      margin-bottom: 2rem;
      
      @include tablet {
        margin-bottom: 1rem;
      }
      
      .question-header {
        display: flex;
        gap: 0.5rem;
        align-items: flex-start;
      }
      
      .question-number {
        color: $color-gray-900;
        font-family: $nunito-font;
        font-size: 24px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        flex-shrink: 0;
        
        @include tablet {
          font-size: 20px;
        }
      }
      
      .question-text {
        flex: 1;
        
        h2 {
          color: $color-gray-900;
          font-family: $nunito-font;
          font-size: 24px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
          margin: 0 0 0.5rem 0;
          
          @include tablet {
            font-size: 20px;
          }
        }
        
        .description {
          color: $color-gray-400;
          font-family: $nunito-font;
          font-size: 16px;
          font-style: italic;
          font-weight: 400;
          line-height: normal;
          margin: 0;
        }
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
        padding: 0.75rem 1.5rem;
        
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
        width: 40px;
        height: 40px;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        color: #64748b;
        
        &:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #1e293b;
        }
        
        &:active {
          transform: scale(0.95);
        }
        
        svg {
          width: 20px;
          height: 20px;
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
