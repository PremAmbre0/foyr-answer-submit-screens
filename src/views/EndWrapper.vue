<script setup>
import { computed, onMounted, ref } from 'vue';
import { useQuestionnaire } from '@/stores/questionnaire.store';
import { storeToRefs } from 'pinia';
import ProgressBar from '@/components/sharedComponents/ProgressBar.vue';
import ConfirmDialog from '@/components/sharedComponents/ConfirmDialog.vue';

const questionnaireStore = useQuestionnaire();
const { questionnaireData } = storeToRefs(questionnaireStore);

const endScreen = computed(() => questionnaireData.value?.endScreen || {});
const isLocked = computed(() => questionnaireData.value?.isLocked || false);

const showRequestEditDialog = ref(false);
const showSuccessDialog = ref(false);
const showErrorDialog = ref(false);

const handleRequestEditClick = () => {
  console.log('[ACTION] Request Edit Access clicked');
  showRequestEditDialog.value = true;
};

const handleConfirmRequestEdit = async () => {
  try {
    const result = await questionnaireStore.requestEditAccess();
    
    if (result.success) {
      showSuccessDialog.value = true;
    } else {
      showErrorDialog.value = true;
    }
  } catch (error) {
    console.error('[ERROR] Request edit access failed:', error);
    showErrorDialog.value = true;
  }
};

const handleDownload = () => {
  console.log('[ACTION] Download Questionnaire clicked');
  // TODO: Implement questionnaire download
};

onMounted(() => {
  questionnaireStore.setShowProgressBar(true);
});
</script>

<template>
  <div class="end-wrapper">
    <ProgressBar />

    <div class="content">
      <div class="message-section">
        <h1>{{ endScreen.title || 'Thank You!' }}</h1>
        <p>{{ endScreen.bodyText || 'We will review your responses and get back to you soon.' }}</p>
        <div v-if="isLocked" class="locked-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Questionnaire Locked
        </div>
      </div>

      <div class="action-buttons">
        <button class="secondary-btn" @click="handleRequestEditClick">Request Edit Access</button>
        <button class="primary-btn" @click="handleDownload">Download Questionnaire</button>
      </div>

      <!-- Confirm Dialog for Request Edit -->
      <ConfirmDialog
        :show="showRequestEditDialog"
        title="Request Edit Access"
        message="Are you sure you want to request edit access? The admin will be notified and you'll receive access once approved."
        icon="info"
        confirm-text="Request"
        cancel-text="Cancel"
        confirm-variant="primary"
        @confirm="handleConfirmRequestEdit"
        @close="showRequestEditDialog = false"
      />

      <!-- Success Dialog -->
      <ConfirmDialog
        :show="showSuccessDialog"
        title="Request Submitted"
        message="Edit access request submitted successfully! You will be notified when access is granted."
        icon="info"
        confirm-text="OK"
        :cancel-text="null"
        confirm-variant="primary"
        @confirm="showSuccessDialog = false"
        @close="showSuccessDialog = false"
      />

      <!-- Error Dialog -->
      <ConfirmDialog
        :show="showErrorDialog"
        title="Request Failed"
        message="Failed to request edit access. Please try again later."
        icon="danger"
        confirm-text="OK"
        :cancel-text="null"
        confirm-variant="danger"
        @confirm="showErrorDialog = false"
        @close="showErrorDialog = false"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/mixins.scss';

.end-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 3rem 2rem;
    max-width: 700px;
    margin: 0 auto;
    width: 100%;
    text-align: center;
    align-items: center;
    justify-content: center;

    @include tablet {
      padding: 2rem 1.5rem;
      max-width: 100%;
      justify-content: space-between;
    }

    .message-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 3rem;

      @include tablet {
        margin-bottom: 0;
        justify-content: center;
        flex: 1;
      }

      h1 {
        font-size: 2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #1e293b;

        @include tablet {
          font-size: 1.75rem;
        }
      }

      p {
        font-size: 1.125rem;
        color: #64748b;
        line-height: 1.6;
        max-width: 500px;
        margin: 0;

        @include tablet {
          font-size: 1rem;
        }
      }

      .locked-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 1.5rem;
        padding: 0.5rem 1rem;
        background: #fef3c7;
        color: #92400e;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;

        svg {
          width: 1rem;
          height: 1rem;
        }
      }
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      width: 100%;
      max-width: 500px;

      @include tablet {
        flex-direction: column-reverse;
        gap: 0.75rem;
        max-width: 100%;
      }

      .secondary-btn {
        @include button-secondary;
        padding: 0.875rem 1.5rem;

        @include tablet {
          width: 100%;
        }
      }

      .primary-btn {
        @include button-primary;
        padding: 0.875rem 2rem;

        @include tablet {
          width: 100%;
        }
      }
    }
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
