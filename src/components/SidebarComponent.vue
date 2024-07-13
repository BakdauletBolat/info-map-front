<script setup lang="ts">
import {ChevronRightIcon, ChevronLeftIcon} from "@heroicons/vue/24/solid";

const model = defineModel<boolean>();

</script>
<template>

  <aside class="w-[350px] top-0 bottom-0 fixed z-[99999] transition-transform shadow bg-white" :class="{
    '-translate-x-[350px] !absolute z-[99998]': !model
  }">
      <div class="overflow-scroll top-0 bottom-0 h-full">
        <slot></slot>
        <div @click="model = !model" class="shadow cursor-pointer !absolute flex justify-center items-center -right-[30px] top-[80px] w-[30px] h-[35px] bg-white z-[909999]">
          <ChevronRightIcon v-if="model" class="w-6 h-6"></ChevronRightIcon>
          <ChevronLeftIcon v-else class="w-6 h-6"></ChevronLeftIcon>
        </div>
      </div>
  </aside>
</template>

<style scoped>

</style>