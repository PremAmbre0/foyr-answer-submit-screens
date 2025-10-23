<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuestionnaire } from '@/stores/questionnaire.store';
import { storeToRefs } from 'pinia';
import ProgressBar from '@/components/sharedComponents/ProgressBar.vue';

const router = useRouter();
const questionnaireStore = useQuestionnaire();
const { questionnaireData } = storeToRefs(questionnaireStore);

const welcomeScreen = computed(() => questionnaireData.value?.welcomeScreen || {});

const startQuestionnaire = () => {
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
      <h1>{{ welcomeScreen.title }}</h1>
      <p>{{ welcomeScreen.description }}</p>
      <button @click="startQuestionnaire">Let's Begin</button>
      
      <div class="debug">
        <pre>{{ JSON.stringify(welcomeScreen, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.welcome-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  .content {
    max-width: 600px;
    text-align: center;

    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      color: #666;
    }

    button {
      padding: 0.75rem 2rem;
      font-size: 1rem;
      background: #000;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background: #333;
      }
    }

    .debug {
      margin-top: 3rem;
      text-align: left;
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 4px;
      overflow: auto;

      pre {
        margin: 0;
        font-size: 0.875rem;
      }
    }
  }
}
</style>
