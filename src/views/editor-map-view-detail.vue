<script setup lang="ts">
import { onMounted } from "vue";
import "vue-select/dist/vue-select.css";
import "leaflet-draw";
import {initData, createModal, save} from "@/domain/map-store-detail.ts";
//@ts-ignore
import VueSelect from "vue-select";
import {useRoute, useRouter} from "vue-router";
import {NDrawer, NDrawerContent, NButton, useMessage} from "naive-ui";
import DefaultForm from "@/components/InfoForms/DefaultForm.vue";
import {geometry} from "@/domain/stores.ts";

const route = useRoute();
const router = useRouter();
const message = useMessage()

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
      <n-drawer-content title="Форма изменении">
        <default-form ></default-form>
      </n-drawer-content>
    </n-drawer>
    <section class="w-full">
      <div class="w-full absolute bottom-5 z-[909999] right-0 flex justify-end gap-3 p-3">
        <n-button @click="router.push({
        name: 'editor-map-view',
        params: {
          slug: geometry.region_slug
        }
        })">Назад</n-button>
        <n-button type="primary" @click="()=>save(route.params.id.toString()).then(()=>{
          message.success('Успешно')
          createModal = false
        })">Сохранить</n-button>
        <n-button type="info" @click="()=>createModal = true">Открыть форму</n-button>
      </div>
      <div :style="{ width: '100%', height: '100%' }" id="map"></div>
    </section>
  </main>
</template>

<style scoped></style>