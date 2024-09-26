<script setup lang="ts">
import {onMounted, ref} from "vue";
import "vue-select/dist/vue-select.css";
import "leaflet-draw";
import {initData, createModal, save} from "@/domain/map-store-detail.ts";
//@ts-ignore
import VueSelect from "vue-select";
import {useRoute, useRouter} from "vue-router";
import {NDrawer, NDrawerContent, NButton, NSpin, useMessage} from "naive-ui";
import DefaultForm from "@/components/InfoForms/DefaultForm.vue";
import {geometry, isLoadingGeometry} from "@/domain/stores.ts";

const route = useRoute();
const router = useRouter();
const message = useMessage()
const isLoadingEdit = ref<boolean>(false);

onMounted(() => {
  initData(parseInt(route.params.id.toString()));
});

const onSave = () => {
  isLoadingEdit.value = true
  save(route.params.id.toString())
      .then(() => {
    message.success('Успешно')
    createModal.value = false
  }).finally(() => isLoadingEdit.value = false)
}

</script>

<template>
  <n-spin :show="isLoadingGeometry">
    <main class="flex w-full min-h-screen">
      <n-drawer
          v-model:show="createModal"
          :default-width="502"
          :placement="'bottom'"
          resizable
      >
        <n-drawer-content title="Форма изменении">
          <default-form></default-form>
        </n-drawer-content>
      </n-drawer>
      <section class="w-full">
        <div class="w-full absolute bottom-5 z-[909999] right-0 flex justify-end gap-3 p-3">
          <n-button @click="router.push({
        name: 'editor-map-view',
        params: {
          slug: geometry.region_slug
        }
        })">Назад
          </n-button>
          <n-button :loading="isLoadingEdit" :disabled="isLoadingEdit" type="primary" @click="onSave">Сохранить</n-button>
          <n-button type="info" @click="()=>createModal = true">Открыть форму</n-button>
        </div>
        <div :style="{ width: '100%', height: '100%' }" id="map"></div>
      </section>
    </main>
  </n-spin>
</template>

<style scoped></style>