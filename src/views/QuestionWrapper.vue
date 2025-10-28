<script setup>
import { computed, onMounted, inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuestionnaire } from '@/stores/questionnaire.store';
import { storeToRefs } from 'pinia';
import ProgressBar from '@/components/sharedComponents/ProgressBar.vue';
import ModeToggle from '@/components/sharedComponents/ModeToggle.vue';
import ConfirmDialog from '@/components/sharedComponents/ConfirmDialog.vue';
import { uploadToS3 } from '@/network/project.service';

const router = useRouter();
const questionnaireStore = useQuestionnaire();
const { currentQuestion, progressPercentage, currentQuestionIndex, totalQuestions, isPreviewMode, questionnaireData } = storeToRefs(questionnaireStore);
const appImages = inject("appImages");

const themeColor = computed(() => questionnaireData.value?.themeColor || '#2563EB');

const isUploading = ref(false);
const uploadingImages = ref([]);
const fileInputRef = ref(null);
const MAX_IMAGES = 10; // Maximum images allowed per question
const validationError = ref('');
const isSubmitting = ref(false);
const showConfirmDialog = ref(false);
const isLastQuestion = computed(() => {
  return currentQuestionIndex.value === totalQuestions.value - 1;
});

const handleNext = async () => {
  console.log('[CTA] Next button clicked');

  const answer = currentQuestion.value.answer;

  // Clear previous validation error
  validationError.value = '';

  // In preview mode, skip validation and allow navigation without answers
  if (!isPreviewMode.value) {
    // Check if answer.response exists and has content
    if (!answer?.response || !answer.response.trim()) {
      console.log('[VALIDATION] No answer provided');
      validationError.value = 'Please provide an answer before proceeding.';
      return;
    }
  }

  // If last question, show submit confirmation
  if (isLastQuestion.value && !isPreviewMode.value) {
    showConfirmDialog.value = true;
    return;
  }

  console.log('[ANSWER]', answer);

  // Submit answer with loading state
  isSubmitting.value = true;
  try {
    await questionnaireStore.submitAnswer(currentQuestion.value._id, answer);
    console.log('[PROGRESS]', progressPercentage.value + '%');

    const hasMore = questionnaireStore.nextQuestion();
    if (!hasMore) {
      console.log('[CTA] Moving to end screen');
      router.push({ name: 'end' });
    }
  } catch (error) {
    console.error('[ERROR] Failed to submit answer:', error);
    // Don't navigate if submission failed
  } finally {
    isSubmitting.value = false;
  }
};

const clearValidationError = () => {
  validationError.value = '';
};

const handleConfirmSubmit = async () => {
  const answer = currentQuestion.value.answer;

  console.log('[ANSWER]', answer);

  // Submit answer with loading state
  isSubmitting.value = true;
  try {
    await questionnaireStore.submitAnswer(currentQuestion.value._id, answer);
    console.log('[PROGRESS]', progressPercentage.value + '%');

    const hasMore = questionnaireStore.nextQuestion();
    if (!hasMore) {
      console.log('[CTA] Moving to end screen');
      router.push({ name: 'end' });
    }
  } catch (error) {
    console.error('[ERROR] Failed to submit answer:', error);
    // Don't navigate if submission failed
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancelSubmit = () => {
  console.log('[ACTION] Submit cancelled');
};

const handlePrevious = () => {
  console.log('[CTA] Previous button clicked');
  questionnaireStore.previousQuestion();
};

const handleImageUpload = () => {
  console.log('[ACTION] Image upload clicked');
  fileInputRef.value?.click();
};

const handleFileSelect = async (event) => {
  const files = Array.from(event.target.files || []);

  // Clear file input immediately to allow re-selection of same files
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }

  if (files.length === 0) return;

  // Check current image count
  const currentImageCount = (currentQuestion.value?.answer?.referenceImagesByCustomer?.length || 0) + uploadingImages.value.length;
  const availableSlots = MAX_IMAGES - currentImageCount;

  if (availableSlots <= 0) {
    alert(`Maximum ${MAX_IMAGES} images allowed per question.`);
    return;
  }

  // Limit files to available slots
  const filesToUpload = files.slice(0, availableSlots);

  if (filesToUpload.length < files.length) {
    alert(`Only ${filesToUpload.length} of ${files.length} images will be uploaded (max ${MAX_IMAGES} images per question).`);
  }

  console.log('[UPLOAD] Selected files:', filesToUpload.length);

  isUploading.value = true;

  // Create upload placeholders for all files
  const uploadTasks = filesToUpload.map(file => {
    const uploadId = Date.now() + Math.random();
    uploadingImages.value.push({ id: uploadId, file });
    return { uploadId, file };
  });

  // Upload all files in parallel
  const uploadPromises = uploadTasks.map(async ({ uploadId, file }) => {
    try {
      // Upload to S3
      const response = await uploadToS3(file);
      const imageUrl = response?.data?.data?.url || response?.data?.url;

      if (imageUrl) {
        // Add uploaded URL to answer
        if (!currentQuestion.value?.answer) {
          currentQuestion.value.answer = {
            response: '',
            rating: null,
            selectedOptions: [],
            referenceImagesByCustomer: []
          };
        }
        if (!currentQuestion.value.answer.referenceImagesByCustomer) {
          currentQuestion.value.answer.referenceImagesByCustomer = [];
        }
        currentQuestion.value.answer.referenceImagesByCustomer.push(imageUrl);
        console.log('[UPLOAD] Image uploaded successfully:', imageUrl);
      }
    } catch (error) {
      console.error('[UPLOAD ERROR]', error);
      alert(`Failed to upload ${file.name}`);
    } finally {
      // Remove from uploading list when this specific upload completes
      uploadingImages.value = uploadingImages.value.filter(img => img.id !== uploadId);
    }
  });

  // Wait for all uploads to complete
  await Promise.all(uploadPromises);

  isUploading.value = false;
};

const handleRemoveImage = (index) => {
  console.log('[ACTION] Remove image at index:', index);
  if (currentQuestion.value?.answer?.referenceImagesByCustomer) {
    currentQuestion.value.answer.referenceImagesByCustomer.splice(index, 1);
  }
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

          <!-- Question Images (Static - from question data) -->
          <div class="dynamic-image-grid questions" v-if="currentQuestion?.imageUrl?.length > 0">
            <div v-for="(imageUrl, index) in currentQuestion.imageUrl" :key="'q-' + index"
              class="image-container static">
              <img :src="imageUrl" :alt="`Question image ${index + 1}`">
            </div>
          </div>
        </div>

        <div class="answer-section">
          <div class="answer-input-wrapper">
            <div class="answer-input">
              <textarea v-if="currentQuestion?.type === 'LONG_TEXT' && currentQuestion?.answer"
                v-model="currentQuestion.answer.response" :class="{ 'error': validationError }"
                @input="clearValidationError" placeholder="Type your answer here" rows="4"></textarea>
              <input v-else-if="currentQuestion?.answer" v-model="currentQuestion.answer.response"
                :class="{ 'error': validationError }" @input="clearValidationError" type="text"
                placeholder="Type your answer here" />
            </div>
            <div v-if="validationError" class="error-message">{{ validationError }}</div>
          </div>

          <!-- Image Grid -->
          <div class="dynamic-image-grid answers"
            v-if="currentQuestion?.answer?.referenceImagesByCustomer?.length > 0 || uploadingImages.length > 0">
            <!-- Uploaded Images -->
            <div v-for="(imageUrl, index) in currentQuestion?.answer?.referenceImagesByCustomer" :key="imageUrl"
              class="image-container">
              <img :src="imageUrl" :alt="`Uploaded image ${index + 1}`">
              <div class="remove-btn" @click="handleRemoveImage(index)" title="Remove image">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </div>
            </div>

            <!-- Uploading Images (Loading State) -->
            <div v-for="upload in uploadingImages" :key="upload.id" class="image-container loading">
              <div class="loading-placeholder">
                <div class="spinner"></div>
              </div>
            </div>
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
          <button v-if="currentQuestionIndex > 0" @click="handlePrevious" class="back-btn"
            :disabled="isUploading || isSubmitting">
            Back
          </button>
          <button @click="handleNext" class="next-btn" :style="{ backgroundColor: themeColor }"
            :disabled="isUploading || isSubmitting">
            <span v-if="isSubmitting">Submitting...</span>
            <span v-else>{{ isLastQuestion ? 'Submit' : 'Next' }}</span>
          </button>
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

    <!-- Hidden File Input -->
    <input ref="fileInputRef" type="file" accept="image/*" multiple style="display: none;" @change="handleFileSelect" />

    <!-- Confirm Dialog -->
    <ConfirmDialog :show="showConfirmDialog" title="Submit Questionnaire"
      message="Once submitted, you won't be able to edit your answers until you request edit access again. Do you want to proceed?"
      confirm-text="Proceed" cancel-text="Cancel" :theme-color="themeColor" @confirm="handleConfirmSubmit"
      @cancel="handleCancelSubmit" @close="showConfirmDialog = false" />
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
      margin-bottom: 1.5rem;

      @include tablet {
        margin-bottom: 0;
        display: flex;
        flex-direction: column;
      }

      .answer-input-wrapper {
        .answer-input {
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

            &.error {
              border-bottom-color: #EF4444;

              &:focus {
                border-bottom-color: #EF4444;
              }
            }
          }

          textarea {
            resize: vertical;
            min-height: 6.25rem;
          }
        }

        .error-message {
          color: #EF4444;
          font-size: 0.75rem;
          font-weight: 400;
          margin-top: 0.25rem;
          line-height: 1.25;
          min-height: 1rem;
        }

        // Reserve space for error message even when not shown
        &::after {
          content: '';
          display: block;
          min-height: 1rem;
          margin-top: 0.25rem;
        }

        // Remove the pseudo-element space when error is shown
        &:has(.error-message) {
          &::after {
            display: none;
          }
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

      &.questions {
        grid-column: 2;
        margin-top: 1rem;
      }

      &.answers {
        margin: .75rem 0;
      }

      .image-container {
        position: relative;
        border-radius: .5rem;
        overflow: hidden;
        min-height: 5.9375rem;
        max-height: 7.5rem;
        background: #f3f4f6;

        &:not(.static):hover .remove-btn {
          opacity: 1;
        }

        &.static .remove-btn {
          display: none;
        }

        img {
          border-radius: .5rem;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .remove-btn {
          position: absolute;
          top: 0.25rem;
          right: 0.25rem;
          width: 1.5rem;
          height: 1.5rem;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s ease, background 0.2s ease;
          color: white;

          &:hover {
            background: rgba(0, 0, 0, 0.8);
          }

          svg {
            width: 0.75rem;
            height: 0.75rem;
          }
        }

        &.loading {
          .loading-placeholder {
            width: 100%;
            height: 100%;
            min-height: 5.9375rem;
            background: #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: center;

            .spinner {
              width: 1.5rem;
              height: 1.5rem;
              border: 2px solid #f3f4f6;
              border-top-color: #6b7280;
              border-radius: 50%;
              animation: spin 0.8s linear infinite;
            }
          }
        }
      }
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
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

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .next-btn {
        @include button-primary;
        padding: 0.75rem 2rem;

        @include tablet {
          width: 100%;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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
