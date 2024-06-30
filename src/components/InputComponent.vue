<script setup lang="ts">
const model = defineModel();
defineProps<{
  placeholder?: string
}>()
</script>

<template>
  <div class="flex flex-col">
    <label>{{placeholder}}</label>
    <input class="p-2 mt-1 border rounded-lg" v-model="model" :placeholder="placeholder"/>
  </div>
</template>

<style scoped>

</style>