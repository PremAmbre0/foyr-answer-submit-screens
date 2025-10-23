<template>
  <div class="hello-component">
    <h1>Hello, I'm component</h1>
  </div>
</template>

<script>
export default {
  name: 'HelloComponent'
}
</script>

<style scoped>
.hello-component {
  text-align: center;
  padding: 20px;
}

.hello-component h1 {
  color: #42b883;
  font-size: 2rem;
}
</style>