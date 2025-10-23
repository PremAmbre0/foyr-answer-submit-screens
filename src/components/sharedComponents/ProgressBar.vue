<script setup>
import { computed } from 'vue';
import { useQuestionnaire } from '@/stores/questionnaire.store';
import { storeToRefs } from 'pinia';

const questionnaireStore = useQuestionnaire();
const { showProgressBar, progressPercentage } = storeToRefs(questionnaireStore);
</script>

<template>
  <div v-if="showProgressBar" class="progress-bar">
    <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
  </div>
</template>

<style scoped lang="scss">
.progress-bar {
  width: 100%;
  height: 4px;
  background: #e0e0e0;
  position: relative;

  .progress-fill {
    height: 100%;
    background: #000;
    transition: width 0.3s ease;
  }
}
</style>
