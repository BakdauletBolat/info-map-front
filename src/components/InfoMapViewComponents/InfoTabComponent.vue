<script setup lang="ts">
import {activeCategoryId, categories, geographic_region, loadUpdateInfo} from "@/domain/stores.ts";
import GeographicInfoComponent from "@/components/GeographicInfoComponent.vue";
import {NDrawer, NTabPane, NTabs, NDrawerContent} from 'naive-ui';
import ImageComponent from "@/components/ImageComponent.vue";
import InformationKeysComponent from "@/components/InfoMapViewComponents/information-keys-component.vue";
import {ref} from "vue";
import {useRoute} from "vue-router";


const showInner = ref(false);
const route = useRoute();

function onClickInnerCategory(index: string) {
  loadUpdateInfo(index, route.params.slug.toString());
  showInner.value = true;
}

</script>

<template>
  <div>
    <n-drawer placement="bottom" :z-index="100000" height="80%" v-model:show="showInner">
      <n-drawer-content closable title="Информация">
        <information-keys-component></information-keys-component>
      </n-drawer-content>
    </n-drawer>
    <n-tabs type="segment" animated>
      <n-tab-pane name="Категориялар бойынша" tab="Категориялар бойынша">
        <div class="grid mt-4 items-start flex-grow-0 grid-cols-3">
          <div
              @click="()=>onClickInnerCategory(category.id.toString())"
              class="flex flex-shrink-0 items-center p-1 cursor-pointer justify-center flex-col"
              v-for="category in categories">
            <div :class="{
              'bg-slate-100 text-white': activeCategoryId == category.id
            }" class="border p-3 flex-shrink-0 rounded-full">
              <image-component class="h-[36px] w-[36px] flex-shrink-0" :url="category.icon"
                               :alt="category.name"></image-component>
            </div>
            <span class="mt-2 text-xs text-center">{{ category.name }}</span>
          </div>
        </div>
      </n-tab-pane>
      <n-tab-pane name="Бастапкы" tab="Бастапкы">
        <div>
          <p class="text-2xl font-bold">{{ geographic_region?.name }}</p>
          <p v-html="geographic_region?.description" class="text-sm mt-2"></p>
        </div>
      </n-tab-pane>
      <n-tab-pane name="Жалпы" tab="Жалпы">
        <section>
          <geographic-info-component :region="geographic_region!"></geographic-info-component>
        </section>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style scoped>

</style>