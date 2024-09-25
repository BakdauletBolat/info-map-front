<script setup lang="ts">
import { onMounted } from "vue";
import "vue-select/dist/vue-select.css";
import "leaflet-draw";
import {initData, createModal, save} from "@/domain/map-store-detail.ts";
//@ts-ignore
import VueSelect from "vue-select";
import {useRoute} from "vue-router";
import {NDrawer, NDrawerContent, NButton} from "naive-ui";

const route = useRoute();


onMounted(() => {
  initData(parseInt(route.params.id.toString()));
});
</script>

<template>
  <main class="flex w-full min-h-screen">
    <n-drawer
        v-model:show="createModal"
        :default-width="502"
        :placement="'bottom'"
        resizable
    >
      <n-drawer-content title="Stoner">
        <n-button @click="()=>save(route.params.id.toString())">Сохранить</n-button>
      </n-drawer-content>
    </n-drawer>
    <section class="w-full">
      <div class="w-full p-3">
        <n-button @click="()=>save(route.params.id.toString())">Сохранить</n-button>
      </div>
      <div :style="{ width: '100%', height: '100%' }" id="map"></div>
    </section>
  </main>
</template>

<style scoped></style>
