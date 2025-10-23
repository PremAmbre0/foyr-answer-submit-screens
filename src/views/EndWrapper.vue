<script setup>
import { computed, onMounted } from 'vue';
import { useQuestionnaire } from '@/stores/questionnaire.store';
import { storeToRefs } from 'pinia';
import ProgressBar from '@/components/sharedComponents/ProgressBar.vue';

const questionnaireStore = useQuestionnaire();
const { questionnaireData } = storeToRefs(questionnaireStore);

const endScreen = computed(() => questionnaireData.value?.endScreen || {});

onMounted(() => {
  questionnaireStore.setShowProgressBar(true);
});
</script>

<template>
  <div class="end-wrapper">
    <ProgressBar />

    <div class="content">
      <h1>{{ endScreen.title }}</h1>
      <p>{{ endScreen.bodyText }}</p>

      <div class="debug">
        <h3>End Screen Object:</h3>
        <pre>{{ JSON.stringify(endScreen, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.end-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
    text-align: center;

    h1 {
      font-size: 2.5rem;
      margin-bottom: 1.5rem;
    }

    p {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 3rem;
    }

    .debug {
      width: 100%;
      background: #f5f5f5;
      padding: 1.5rem;
      border-radius: 4px;
      overflow: auto;
      text-align: left;

      h3 {
        margin-top: 0;
        margin-bottom: 1rem;
      }

      pre {
        margin: 0;
        font-size: 0.875rem;
        overflow: auto;
      }
    }
  }
}
</style>
