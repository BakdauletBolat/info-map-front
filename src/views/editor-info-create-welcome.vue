<template>
<header class="p-2 shadow-sm">
  <div class="container mx-auto">
    <h2 class="text-2xl">Выборка населенного пункта</h2>
  </div>
</header>
  <main class="pt-4 bg-sky-50 min-h-screen">
    <section class="container mx-auto h-full grid grid-cols-[200px_1fr]">
      <aside>
        <n-steps vertical :current="current as number" :status="currentStatus">
          <n-step
              :title="'Выбрать город'"
          />
          <n-step
              title="Выбрать категорию"
          />
        </n-steps>
      </aside>
      <main>
        <div v-if="current == 1" class="max-w-2xl mx-auto">
          <n-select v-model:value="region_slug" filterable :options="regionsOptions" placeholder="Город"></n-select>
          <n-button type="primary" @click="current=2" class="mt-4">Дальше</n-button>
        </div>
        <div v-if="current == 2" class="max-w-2xl mx-auto">
          <n-select filterable :options="categoriesOptions" v-model:value="category_id" placeholder="Категория"></n-select>
          <n-button-group>
            <n-button @click="current=1" class="mt-4">Назад</n-button>
            <n-button type="primary" @click="handleCreate" class="mt-4">Дальше</n-button>
          </n-button-group>
        </div>
      </main>
    </section>
  </main>
</template>
<script lang="ts" setup>
import {computed, onMounted, ref, watch} from 'vue';
import {NSteps, NStep, NSelect, SelectOption,useMessage, NButton, NButtonGroup} from 'naive-ui';
import {loadRegion, geographic_region,categories, loadCategories} from "@/domain/stores.ts";
import {IGeographicRegion} from "@/domain/models.ts";
import {useRouter} from "vue-router";

const message = useMessage();

const router = useRouter();

const current = ref(1);
const currentStatus = ref();
const region_slug = ref(null);
const category_id = ref(null);

const main_region_slug = "baidybek_d";

onMounted(()=>{
  loadRegion(main_region_slug);
  loadCategories()
})

function getOptions(value: IGeographicRegion, options: SelectOption[]) {
  if (value.children != null) {
    value.children.forEach(child=>{
      getOptions(child, options)
    })
  }
  options.push({
    value: value.slug,
    label: value.name
  });
}

function handleCreate() {
  if (category_id.value == null || region_slug.value == null) {
    message.warning('Выберите оба поля');
    return;
  }
  router.push({
    name: 'editor-info-create-form',
    params: {
      regionId: region_slug.value,
      categoryId: category_id.value,
    }
  })
}


const regionsOptions = computed(()=>{
  if (geographic_region.value == undefined) {
    return [];
  }
  const options: SelectOption[] = [];
      getOptions(geographic_region.value, options);
      return options;
});

const categoriesOptions = computed(()=>{
  return categories.value.map(item=>{
    return {value: item.id, label: item.name};
  })
})
</script>