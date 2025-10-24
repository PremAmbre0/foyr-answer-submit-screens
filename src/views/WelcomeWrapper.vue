<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuestionnaire } from '@/stores/questionnaire.store';
import { useUIStates } from '@/stores/uiStates.store';
import { storeToRefs } from 'pinia';
import ProgressBar from '@/components/sharedComponents/ProgressBar.vue';
import ModeToggle from '@/components/sharedComponents/ModeToggle.vue';

const router = useRouter();
const questionnaireStore = useQuestionnaire();
const uiStatesStore = useUIStates();
const { questionnaireData } = storeToRefs(questionnaireStore);
const { selectedMode } = storeToRefs(uiStatesStore);

const welcomeScreen = computed(() => questionnaireData.value?.welcomeScreen || {});

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
      <div class="logo iwfh">
        <!-- <img :src="welcomeScreen.logoUrl || 'https://picsum.photos/200/300'" alt="Logo" /> -->
        <img src="https://picsum.photos/200/300" alt="Logo" />
      </div>

      <!-- Title and Description -->
      <div class="title">{{ welcomeScreen.title || 'Welcome to Your Kitchen Vision Questionnaire' }}</div>
      <div class="description">{{ welcomeScreen.description || 'Tell us a bit about your vision for your dream kitchen.'
        }}</div>

      <!-- Mode Toggle -->
      <ModeToggle :showText="true" />

      <!-- Conversation Mode WIP or Start Button -->
      <!-- <ConversationMode v-if="selectedMode === 'conversation'" /> -->
      <div class="cta-section">
        <button class="start-button" @click="startQuestionnaire">Let's Begin</button>
      </div>
    </div>

    <div class="bottom-yellow-highlight">

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
  background: #fafafa;
  overflow: hidden;

  .bottom-yellow-highlight {
    width: 67.32vh;
    height: 67.32vh;
    border-radius: 67.32vh;
    opacity: 0.2;
    background: #FAB31C;
    filter: blur(6.25rem);
    position: fixed;
    bottom: -54.95vh;
  }

  @include tablet {
    padding: 0;
  }

  .content {
    width: 100%;
    text-align: center;
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
      height: 7.875rem;
      margin-bottom: 1.25rem;
      margin-top: auto;

      @include tablet {
        width: 6.25rem;
        height: 6.25rem;
      }
    }

    .title {
      color: #111827;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .description {
      color: #4B5563;
      font-size: 1rem;
      font-weight: 500;
      margin-bottom: 2.5rem;
    }


    .cta-section {
      width: 100%;
      display: flex;
      margin-top: 1.5rem;
      justify-content: center;

      @include tablet {
        margin-top: auto;
      }
    }

    .start-button {
      @include button-primary;
    }
  }
}
</style>
