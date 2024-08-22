<template>
<header class="p-2 shadow-sm">
  <div class="container mx-auto">
    <h2 class="text-2xl">Создание</h2>
  </div>
</header>
  <main class="pt-4 bg-sky-50 min-h-screen">
    <section class="container mx-auto h-full grid grid-cols-[200px_1fr]">
      <aside>
        <n-steps vertical :current="current as number" :status="currentStatus">
          <n-step
              title="Выбрать город"
          />
          <n-step
              title="Выбрать категорию"
          />
        </n-steps>
      </aside>
      <main>
        <div class="max-w-2xl mx-auto">
          <n-select filterable :options="regionsOptions" placeholder="Город"></n-select>
          <n-button @click="current=2" class="mt-4">След</n-button>
        </div>
      </main>
    </section>
  </main>
</template>
<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue';
import {NSteps, NStep, NSelect, SelectOption, NButton} from 'naive-ui';
import {loadRegion, geographic_region} from "@/domain/stores.ts";
import {IGeographicRegion} from "@/domain/models.ts";
const current = ref(1)
const currentStatus = ref();;

onMounted(()=>{
  loadRegion("baidybek_d")
})

function getOptions(value: IGeographicRegion, options: SelectOption[]) {
  if (value.children != null) {
    value.children.forEach(child=>{
      getOptions(child, options)
    })
  }
  options.push({
    value: value.id,
    label: value.name
  });
}

const regionsOptions = computed(()=>{
  if (geographic_region.value == undefined) {
    return [];
  }
  const options: SelectOption[] = [];
      getOptions(geographic_region.value, options);
      return options;
})
</script>