<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {
  geographic_region,
  loadCategories, showCity, showInfo,
  isLoadingGeometries
} from "@/domain/stores.ts";
import SidebarComponent from "@/components/SidebarComponent.vue";
import ModalComponent from "@/components/ModalComponent.vue";
import SwiperSliderGeographic from "@/components/SwiperSliderGeographic.vue";
import InfoTabComponent from "@/components/InfoMapViewComponents/InfoTabComponent.vue";
import {initData, onChangeCity} from "@/domain/map-store.ts";
import InfoMapSidebar from "@/components/InfoMapViewComponents/InfoMapSidebar.vue";
import {NDrawer, NDrawerContent, NButton, NSpin} from "naive-ui";

const route = useRoute();
const router = useRouter();

const showModal = ref<boolean>(true);


onMounted(()=>{
  loadCategories();
  if (document.body.offsetWidth <= 400) {
    showModal.value = false;
  }
  initData(route.params.slug.toString(), false, []);
});

</script>

<template>
  <n-spin :show="isLoadingGeometries">
    <modal-component :blured="true" v-model="showCity" class="z-[999999]">
      <SwiperSliderGeographic @onChange="(slug: string)=>onChangeCity(router, slug)"
                              v-if="geographic_region"
                              :region="geographic_region">
      </SwiperSliderGeographic>
    </modal-component>
    <n-drawer placement="bottom" :z-index="100000" height="90%" v-model:show="showInfo">
      <n-drawer-content closable title="Акпараттар">
        <info-tab-component></info-tab-component>
      </n-drawer-content>
    </n-drawer>
    <main
      class="flex w-full min-h-screen">
      <SidebarComponent v-model="showModal"
                        class="flex-shrink-0">
        <InfoMapSidebar></InfoMapSidebar>
      </SidebarComponent>
      <div class="absolute top-2">

      </div>
      <section class="w-full">
        <div class="w-full absolute bottom-5 z-[909999] right-0 flex justify-end gap-3 p-3">
          <n-button type="primary">
            <router-link :to="{
              name: 'editor-map-view',
              params: {slug: route.params.slug.toString()}
            }">Открыть редактор</router-link></n-button>
        </div>
        <div :style="{width:'100%',height: '100%'}" id="map"></div>
      </section>
    </main>
  </n-spin>
</template>

<style scoped>

</style>