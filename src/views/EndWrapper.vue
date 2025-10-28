<script setup>
import { computed, onMounted } from 'vue';
import { useQuestionnaire } from '@/stores/questionnaire.store';
import { storeToRefs } from 'pinia';
import ProgressBar from '@/components/sharedComponents/ProgressBar.vue';

const questionnaireStore = useQuestionnaire();
const { questionnaireData } = storeToRefs(questionnaireStore);

const endScreen = computed(() => questionnaireData.value?.endScreen || {});
const isLocked = computed(() => questionnaireData.value?.isLocked || false);
const themeColor = computed(() => questionnaireData.value?.themeColor || '#2563EB');

const handleRequestEditClick = async () => {
  console.log('[ACTION] Request Edit Access clicked');
  
  try {
    const result = await questionnaireStore.requestEditAccess();
    
    if (result.success) {
      console.log('[SUCCESS] Edit access request submitted');
    } else {
      console.error('[ERROR] Edit access request failed');
    }
  } catch (error) {
    console.error('[ERROR] Request edit access failed:', error);
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
      </div>

      <div class="action-buttons">
        <button class="secondary-btn" @click="handleRequestEditClick">Request Edit Access</button>
        <button class="primary-btn" :style="{ backgroundColor: themeColor }" @click="handleDownload">Download
          Questionnaire</button>
      </div>
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
