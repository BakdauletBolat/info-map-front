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
            {{ geographic_region?.name }}
          </n-descriptions-item>
          <n-descriptions-item label="Категория">
            {{getCategoryById()}}
          </n-descriptions-item>
        </n-descriptions>
      </aside>
      <main>
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
import {categories, geographic_region, isLoadingRegion, loadCategories, loadRegion} from "@/domain/stores.ts";

const route = useRoute();
const message = useMessage()
const value = ref([{
  key: 'test',
  value: 'test-label'
}]);
const isLoading = ref(false);

watch(geographic_region, (state)=>{
  if (state != undefined) {
    value.value = state!.info.map(item=>{
      return {
        key: item.title,
        value: item.value
      }
    })
  }

})



onMounted(()=>{
  loadCategories();
  loadRegion(route.params.regionId.toString())
})

function getCategoryById() {
  const c = categories.value.find(item=>item.id==parseInt(route.params.categoryId.toString()));
  if (c != undefined) {
    return c.name;
  }
  return ''
}

function handleCreate() {
  isLoading.value = true;
  const body = value.value.map(item=>{
    return {
      title: item.key,
      value: item.value
    }
  })
  apiInstance.post(`/api/region/${route.params.regionId}/update_info/`, body).then(_=>{
    message.success("Успешно")
  }).catch(e=>{
    message.error("Что то не так "+e.toString());
  }).finally(()=>{
    isLoading.value = false;
  })
}
</script>