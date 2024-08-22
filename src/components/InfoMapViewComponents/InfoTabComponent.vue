<script setup lang="ts">
import {geographic_region} from "@/domain/stores.ts";
import {ref} from "vue";
import GeographicInfoComponent from "@/components/GeographicInfoComponent.vue";
import ImageComponent from "@/components/ImageComponent.vue";

const activeTab = ref<number>(0);

function getTabText(region: any) {
  if (region.level == 0) {
    return 'Ауылдық округ'
  }
  else if (region.level == 1) {
    return 'Ауыл'
  }
  return 'Қала'
}

</script>

<template>
  <div>
    <section class="grid gap-2 lg:grid-cols-[1fr_350px]">
      <div>
        <p class="text-2xl font-bold">{{ geographic_region?.name }}</p>
        <p class="text-sm mt-2">{{ geographic_region?.description }}</p>
      </div>
      <ImageComponent class="rounded" :alt="geographic_region?.name" :url="geographic_region?.photo"/>
    </section>
    <section>
      <geographic-info-component :region="geographic_region!"></geographic-info-component>
    </section>
  </div>
</template>

<style scoped>

</style>