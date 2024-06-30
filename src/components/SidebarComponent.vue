<script setup lang="ts">
import {ChevronRightIcon, ChevronLeftIcon} from "@heroicons/vue/24/solid";

const model = defineModel<boolean>();

</script>
<template>
  <aside class="relative transition-transform shadow bg-white min-h-screen" :class="{
    '-translate-x-[350px] !absolute z-[99998]': !model
  }">
    <div>
      <slot></slot>
      <div @click="model = !model" class="shadow cursor-pointer absolute flex justify-center items-center -right-[30px] top-[80px] w-[30px] h-[35px] bg-white z-[99999]">
        <ChevronRightIcon v-if="model" class="w-6 h-6"></ChevronRightIcon>
        <ChevronLeftIcon v-else class="w-6 h-6"></ChevronLeftIcon>
      </div>
    </div>

  </aside>
</template>

<style scoped>

</style>