<script setup>
import { computed, onMounted } from 'vue';
import { useQuestionnaire } from '@/stores/questionnaire.store';
import { storeToRefs } from 'pinia';
import ProgressBar from '@/components/sharedComponents/ProgressBar.vue';

const questionnaireStore = useQuestionnaire();
const { questionnaireData } = storeToRefs(questionnaireStore);

const endScreen = computed(() => questionnaireData.value?.endScreen || {});

const handleRequestEdit = () => {
  console.log('[ACTION] Request Edit Access clicked');
  // TODO: Implement edit access request
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
        <div class="success-icon">✅</div>
        <h1>{{ endScreen.title || 'Thank You!' }}</h1>
        <p>{{ endScreen.bodyText || 'We will review your responses and get back to you soon.' }}</p>
      </div>
      
      <div class="action-buttons">
        <button class="secondary-btn" @click="handleRequestEdit">Request Edit Access</button>
        <button class="primary-btn" @click="handleDownload">Download Questionnaire</button>
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
      
      .success-icon {
        font-size: 4rem;
        margin-bottom: 1.5rem;
        animation: scaleIn 0.5s ease;
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
