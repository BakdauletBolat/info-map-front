<script setup lang="ts">
import NoFoundObject from '@/assets/no-found-object.svg';
defineProps(['url', 'alt']);
</script>

<template>
<div>
  <img v-if="url" :alt="alt" class="w-full h-full" :src="url"/>
  <img v-else class="w-full h-full" alt="not found" :src="NoFoundObject">
</div>
</template>

<style scoped>

</style>