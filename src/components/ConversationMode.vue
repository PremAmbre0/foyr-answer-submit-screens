<script setup>
// Conversation mode component - Work in Progress
</script>

<template>
  <div class="conversation-mode">
    <div class="wip-message">
      <div class="icon">🚧</div>
      <h2>Conversation Mode</h2>
      <p>This feature is currently under development.</p>
      <p class="sub-text">Please use Text Mode for now.</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.conversation-mode {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;

  .wip-message {
    text-align: center;
    max-width: 500px;

    .icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    h2 {
      font-size: 1.75rem;
      margin-bottom: 1rem;
      color: #333;
    }

    p {
      font-size: 1.125rem;
      color: #666;
      margin-bottom: 0.5rem;

      &.sub-text {
        font-size: 1rem;
        color: #999;
      }
    }
  }
}
</style>
