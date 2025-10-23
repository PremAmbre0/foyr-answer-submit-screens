<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuestionnaire } from '@/stores/questionnaire.store';
import { storeToRefs } from 'pinia';
import ProgressBar from '@/components/sharedComponents/ProgressBar.vue';
import ConversationMode from '@/components/ConversationMode.vue';

const router = useRouter();
const questionnaireStore = useQuestionnaire();
const { questionnaireData } = storeToRefs(questionnaireStore);

const welcomeScreen = computed(() => questionnaireData.value?.welcomeScreen || {});
const selectedMode = ref('text'); // 'text' or 'conversation'

const selectMode = (mode) => {
  selectedMode.value = mode;
  console.log('[MODE] Selected mode:', mode);
};

const startQuestionnaire = () => {
  if (selectedMode.value === 'conversation') {
    console.log('[CTA] Conversation mode not available yet');
    return;
  }
  console.log('[CTA] Let\'s Begin button clicked');
  router.push({ name: 'question' });
};

onMounted(() => {
  questionnaireStore.setShowProgressBar(false);
});
</script>

<template>
  <div class="welcome-wrapper">
    <ProgressBar />
    <div class="content">
      <!-- Logo -->
      <div class="logo">
        <img :src="welcomeScreen.logoUrl || 'https://picsum.photos/200/300'" alt="Logo" />
      </div>

      <!-- Title and Description -->
      <h1>{{ welcomeScreen.title || 'Welcome to Your Kitchen Vision Questionnaire' }}</h1>
      <p class="description">{{ welcomeScreen.description || 'Tell us a bit about your vision for your dream kitchen.' }}</p>

      <!-- Mode Toggle -->
      <div class="mode-toggle">
        <button 
          class="mode-button"
          :class="{ active: selectedMode === 'text' }"
          @click="selectMode('text')"
        >
          <span class="icon">📝</span>
          Text Mode
        </button>
        <button 
          class="mode-button"
          :class="{ active: selectedMode === 'conversation' }"
          @click="selectMode('conversation')"
        >
          <span class="icon">💬</span>
          Conversation Mode
        </button>
      </div>

      <!-- Conversation Mode WIP or Start Button -->
      <div class="cta-section">
        <ConversationMode v-if="selectedMode === 'conversation'" />
        <button v-else class="start-button" @click="startQuestionnaire">Let's Begin</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/mixins.scss';

.welcome-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f8f9fa;
  
  @include tablet {
    padding: 0;
  }

  .content {
    max-width: 700px;
    width: 100%;
    text-align: center;
    padding: 3rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    @include tablet {
      padding: 2rem 1.5rem;
      max-width: 100%;
      height: 100vh;
      justify-content: space-between;
    }

    .logo {
      width: 120px;
      height: 120px;
      margin-bottom: 2rem;
      flex-shrink: 0;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
      }
      
      @include tablet {
        width: 100px;
        height: 100px;
      }
    }

    h1 {
      font-size: 1.75rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
      color: #1a1a1a;
      line-height: 1.3;
    }

    .description {
      font-size: 1rem;
      margin-bottom: 2rem;
      color: #666;
      line-height: 1.5;
    }

    .mode-toggle {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 3rem;
      
      @include tablet {
        gap: 0.75rem;
        margin-bottom: 0;
      }

      .mode-button {
        flex: 1;
        max-width: 200px;
        padding: 0.875rem 1.5rem;
        font-size: 0.9375rem;
        background: #f5f5f5;
        color: #666;
        border: 2px solid transparent;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        
        @include tablet {
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          max-width: 100%;
        }

        .icon {
          font-size: 1.125rem;
        }

        &:hover {
          background: #ebebeb;
        }

        &.active {
          background: #1e293b;
          color: #fff;
          border-color: #1e293b;
        }
      }
    }

    .cta-section {
      width: 100%;
      display: flex;
      justify-content: center;
      
      @include tablet {
        margin-top: auto;
      }
    }
    
    .start-button {
      @include button-primary;
      width: 100%;
      max-width: 300px;
      
      @include tablet {
        max-width: 100%;
      }
    }
  }
}
</style>
