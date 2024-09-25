<script setup lang="ts">
import { onMounted } from "vue";
import "vue-select/dist/vue-select.css";
import "leaflet-draw";
import {initData} from "@/domain/map-store-detail.ts";
//@ts-ignore
import VueSelect from "vue-select";
import {useRoute} from "vue-router";

const route = useRoute();

onMounted(() => {
  initData(parseInt(route.params.id.toString()));
});
</script>

<template>
  <main class="flex w-full min-h-screen">
    <section class="w-full">
      <div :style="{ width: '100%', height: '100%' }" id="map"></div>
    </section>
  </main>
</template>

<style scoped></style>
