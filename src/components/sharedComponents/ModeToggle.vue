<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, inject } from 'vue';
import { useUIStates } from '@/stores/uiStates.store';
import { storeToRefs } from 'pinia';

const props = defineProps({
  showText: {
    type: Boolean,
    default: true
  }
});

const appImages = inject('appImages');
const uiStatesStore = useUIStates();
const { selectedMode } = storeToRefs(uiStatesStore);

const sliderLeft = ref(0);
const sliderWidth = ref(0);
const textButton = ref(null);
const conversationButton = ref(null);
const modeToggle = ref(null);

const handleSliderAnimation = (targetMode) => {
  const container = modeToggle.value;
  const targetEl = targetMode === 'conversation' ? conversationButton.value : textButton.value;
  
  if (!container || !targetEl) return;
  
  const containerRect = container.getBoundingClientRect();
  const targetRect = targetEl.getBoundingClientRect();
  
  sliderLeft.value = targetRect.left - containerRect.left;
  sliderWidth.value = targetRect.width;
};

const selectMode = (mode) => {
  // Calculate slider position before mode change for smooth animation
  handleSliderAnimation(mode);
  // Update mode in store
  uiStatesStore.setMode(mode);
};

onMounted(() => {
  nextTick(() => {
    handleSliderAnimation(selectedMode.value);
  });
  window.addEventListener('resize', () => handleSliderAnimation(selectedMode.value));
});

onUnmounted(() => {
  window.removeEventListener('resize', () => handleSliderAnimation(selectedMode.value));
});
</script>

<template>
  <div class="mode-toggle" :class="{ 'icon-only': !showText }" ref="modeToggle">
    <div class="slider" :style="{
      left: sliderLeft + 'px',
      width: sliderWidth + 'px'
    }" />
    <div class="mode-button" :class="{ active: selectedMode === 'text' }" @click="selectMode('text')" ref="textButton">
      <img class="icon iwpar" :src="appImages['text-block.svg']" alt="Text mode" />
      <span v-if="showText">Text Mode</span>
    </div>
    <div class="mode-button" :class="{ active: selectedMode === 'conversation' }" @click="selectMode('conversation')"
      ref="conversationButton">
      <img class="icon iwpar" :src="appImages['voice-square.svg']" alt="Conversation mode" />
      <span v-if="showText">Conversation Mode</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mode-toggle {
  display: flex;
  position: relative;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  padding: .375rem .5rem;
  border-radius: 6.25rem;
  background: #F9FAFB;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  &.icon-only {
    padding: 0.375rem 0.375rem;
  }

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

  &.icon-only .slider {
    height: calc(100% - 0.75rem);
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
    flex: 0 0 auto;
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

  &.icon-only .mode-button {
    padding: .375rem;
    flex: 0;
  }
}
</style>
