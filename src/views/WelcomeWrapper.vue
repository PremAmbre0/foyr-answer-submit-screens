<script setup>
import { ref, computed, onMounted, onUnmounted, inject, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useQuestionnaire } from '@/stores/questionnaire.store';
import { storeToRefs } from 'pinia';
import ProgressBar from '@/components/sharedComponents/ProgressBar.vue';
import ConversationMode from '@/components/ConversationMode.vue';
const appImages = inject('appImages')
const router = useRouter();
const questionnaireStore = useQuestionnaire();
const { questionnaireData } = storeToRefs(questionnaireStore);

const welcomeScreen = computed(() => questionnaireData.value?.welcomeScreen || {});
const selectedMode = ref('text'); // 'text' or 'conversation'
// Removed unused width variables - we measure dynamically
const sliderLeft = ref(0);
const sliderWidth = ref(0);
const textButton = ref(null);
const conversationButton = ref(null);
const modeToggle = ref(null);

const selectMode = (mode) => {
  // Measure the target button BEFORE changing the mode so the slider animates to it
  const container = modeToggle.value;
  const targetEl = mode === 'conversation' ? conversationButton.value : textButton.value;
  if (container && targetEl) {
    const containerRect = container.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    sliderLeft.value = (targetRect.left - containerRect.left);
    sliderWidth.value = targetRect.width  // Subtract total padding
  }
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

const measureActiveButton = () => {
  const container = modeToggle.value;
  const activeEl = selectedMode.value === 'conversation' ? conversationButton.value : textButton.value;
  if (!container || !activeEl) return;
  const containerRect = container.getBoundingClientRect();
  const activeRect = activeEl.getBoundingClientRect();
  sliderLeft.value = (activeRect.left - containerRect.left);
  sliderWidth.value = activeRect.width;
};

onMounted(() => {
  questionnaireStore.setShowProgressBar(false);

  // Measure button widths for dynamic slider sizing
  nextTick(() => {

    // Removed unused width measurements - we measure dynamically on click
    measureActiveButton();
  });
  window.addEventListener('resize', measureActiveButton);
});

onUnmounted(() => {
  window.removeEventListener('resize', measureActiveButton);
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
      <div class="mode-toggle" ref="modeToggle">
        <div class="slider" :style="{
          left: (sliderLeft / 16) + 'rem',
          width: (sliderWidth / 16) + 'rem'
        }" />
        <div class="mode-button" :class="{ active: selectedMode === 'text' }" @click="selectMode('text')"
          ref="textButton">
          <img class="icon iwpar" :src="appImages['text-block.svg']"></img>
          Text Mode
        </div>
        <div class="mode-button" :class="{ active: selectedMode === 'conversation' }"
          @click="selectMode('conversation')" ref="conversationButton">
          <img class="icon iwpar" :src="appImages['voice-square.svg']"></img>
          Conversation Mode
        </div>
      </div>

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

    .mode-toggle {
      display: flex;
      position: relative;
      overflow: hidden;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
      padding: .375rem .5rem;
      border-radius: 6.25rem;
      background: #F9FAFB;

      /* shadow/sm */
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

      .slider {
        position: absolute;
        top: 50%;
        left: 0;
        height: calc(100% - 0.75rem);
        border-radius: 6.25rem;
        background: #FFF;
        transform: translateY(-50%);
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        transition: all 250ms cubic-bezier(.4, 0, .2, 1);
      }

      .mode-button {
        display: flex;
        padding: .375rem .75rem;
        justify-content: center;
        align-items: center;
        gap: .5rem;
        cursor: pointer;
        color: #6B7280;
        text-align: center;
        font-size: .875rem;
        font-weight: 500;
        flex: 1;
        position: relative;
        z-index: 1;
        white-space: nowrap;


        .icon {
          width: 1rem;
          height: 1rem;
          flex-shrink: 0;
        }

        &.active {
          color: #111827;
          font-weight: 600;
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
    }
  }
}
</style>
