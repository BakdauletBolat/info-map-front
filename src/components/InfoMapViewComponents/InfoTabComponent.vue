<script setup lang="ts">
import {geographic_region} from "@/domain/stores.ts";
import {ref} from "vue";
import GeographicInfoComponent from "@/components/GeographicInfoComponent.vue";

const activeTab = ref<number>(0);

</script>

<template>
  <div class="p-4">
    <div class="flex gap-2">
      <div @click="activeTab=0" class="p-2 border cursor-pointer border-transparent " :class="{
          '!border-slate-400 rounded ': activeTab == 0
        }">Общая информация</div>
      <div @click="activeTab=1" class="p-2 border cursor-pointer border-transparent " :class="{
          '!border-slate-400 rounded': activeTab == 1
        }">Информация о место</div>
    </div>
    <GeographicInfoComponent v-if="activeTab==0" :region="geographic_region!"></GeographicInfoComponent>
    <div v-if="activeTab==1">
      <h2 class="font-bold">Название</h2>
      <p class="text-sm">{{geographic_region?.name}}</p>
      <p class="mt-2">Описание</p>
      <p class="text-sm">{{geographic_region?.description}}</p>
    </div>
  </div>
</template>

<style scoped>

</style>