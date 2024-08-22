<template>
  <header class="p-2 shadow-sm">
    <div class="flex gap-2 container px-4 mx-auto">
      <router-link :to="{
        name: 'editor-info-create-welcome',
      }"><n-button>Назад</n-button></router-link>
      <h2 class="text-2xl">Создание информаций</h2>
    </div>
  </header>
  <main class="bg-sky-50 min-h-screen">
    <section class="container py-4 px-4 mx-auto h-full grid grid-cols-[200px_1fr]">
      <aside>
        <n-descriptions label-placement="top" :column="1">
          <n-descriptions-item label="Насаленный пункт">
            {{ updateInfo?.region_name }}
          </n-descriptions-item>
          <n-descriptions-item label="Категория">
            {{updateInfo?.category_name}}
          </n-descriptions-item>
        </n-descriptions>
      </aside>
      <main>
        <div class="p-4 font-bold text-xl">Основные данные</div>
        <div>
          <quill-editor contentType="html" v-model:content="description" class="bg-white" toolbar="full" theme="snow" />
        </div>

        <div class="p-4 font-bold text-xl">Данные по категориям</div>
        <n-spin :show="isLoadingRegion">
          <n-dynamic-input
              v-model:value="value"
              preset="pair"
              key-placeholder="Название ключа"
              value-placeholder="Название значений"
          />
        </n-spin>
        <n-button :loading="isLoading" type="primary" class="mt-4" @click="handleCreate">Создать / Обновить</n-button>
      </main>
    </section>
  </main>
</template>
<script lang="ts" setup>
import {NButton, NDescriptions, NDescriptionsItem, NDynamicInput, useMessage, NSpin} from "naive-ui";
import {onMounted, ref, watch} from "vue";
import apiInstance from "@/api/instance.ts";
import {useRoute} from "vue-router";
import {updateInfo, isLoadingRegion, loadUpdateInfo} from "@/domain/stores.ts";
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';


const route = useRoute();
const message = useMessage()
const description = ref('');
const value = ref([{
  key: 'test',
  value: 'test-label'
}]);
const isLoading = ref(false);

watch(updateInfo, (state)=>{
  if (state != undefined) {
    value.value = state!.infos.map(item=>{
      return {
        key: item.title,
        value: item.value
      }
    })
    description.value = state.description
  }

})



onMounted(()=>{
  loadUpdateInfo(route.params.categoryId.toLocaleString(), route.params.regionId.toString());
})


function handleCreate() {
  isLoading.value = true;
  const infos = value.value.map(item=>{
    return {
      title: item.key,
      value: item.value
    }
  })
  const body = {
    information_keys: infos,
    category_id: route.params.categoryId,
    description: description.value
  }
  apiInstance.post(`/api/region/${updateInfo.value?.region_id}/update_info/`, body).then(_=>{
    message.success("Успешно");
  }).catch(e=>{
    message.error("Что то не так "+e.toString());
  }).finally(()=>{
    isLoading.value = false;
  })
}
</script>