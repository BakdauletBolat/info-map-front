<script setup lang="ts">
import {geographic_region} from "@/domain/stores.ts";
import {ref} from "vue";
import GeographicInfoComponent from "@/components/GeographicInfoComponent.vue";
import ImageComponent from "@/components/ImageComponent.vue";

const activeTab = ref<number>(0);

</script>

<template>
  <div class="p-4">
    <div class="flex gap-2">
      <div @click="activeTab=0" class="p-2 border-b-2 cursor-pointer border-transparent " :class="{
          '!border-blue-900 ': activeTab == 0
        }">Общая информация</div>
      <div @click="activeTab=1" class="p-2 border-b-2 cursor-pointer border-transparent " :class="{
          '!border-blue-900': activeTab == 1
        }">Информация о место</div>
    </div>
    <GeographicInfoComponent v-if="activeTab==0" :region="geographic_region!"></GeographicInfoComponent>
    <div class="grid mt-4 gap-2 lg:grid-cols-[1fr_350px]" v-if="activeTab==1">
      <div>
        <h2 class="font-bold">Название</h2>
        <p class="text-sm">{{geographic_region?.name}}</p>
        <p class="mt-2 font-bold">Описание</p>
        <p class="text-sm">{{geographic_region?.description}}</p>
      </div>
      <ImageComponent class="rounded" :alt="geographic_region?.name" :url="geographic_region?.photo"/>
    </div>
  </div>
</template>

<style scoped>

</style>