<script setup lang="ts">
import {XMarkIcon} from "@heroicons/vue/24/solid";
const model = defineModel<boolean>();
defineProps<{
  blured?: boolean
}>()

</script>

<template>
<transition>
  <div v-if="model" :class="{
  '!blured-background w-full': blured,
}" class="overflow-hidden h-screen w-full flex justify-center bg-black-transparent top-0 left-0 absolute">
    <div class="w-full" v-if="blured">
      <slot></slot>
      <div class="cursor-pointer bg-slate-900 rounded
   z-[9999] absolute top-6 right-6">
        <XMarkIcon @click="model = false" class="w-9 text-white h-9"></XMarkIcon>
      </div>
    </div>
    <div v-else class="shadow rounded-tl-2xl overflow-scroll rounded-tr-2xl w-full md:w-[800px] bg-white mt-[40px]">
        <slot>
        </slot>
      <div class="cursor-pointer bg-slate-900 rounded
   z-[9999] absolute top-6 right-6">
        <XMarkIcon @click="model = false" class="w-9 text-white h-9"></XMarkIcon>
      </div>
    </div>
  </div>
</transition>
</template>

<style scoped>
.blured-background {
  backdrop-filter: blur(4px);
  background: rgba(1,5,44,49%);
}
.bg-black-transparent {
  background: rgba(0,0,0,50%);
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>