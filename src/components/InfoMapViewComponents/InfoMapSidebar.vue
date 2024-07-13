<script setup lang="ts">
import {activeCategoryId, categories, geographic_region, showCity, showInfo} from "@/domain/stores.ts";
import {ChevronLeftIcon, InformationCircleIcon, HomeModernIcon, UserGroupIcon} from "@heroicons/vue/24/outline";
import ImageComponent from "@/components/ImageComponent.vue";
import {onChangeCity} from "@/domain/map-store.ts";
import {useRouter} from "vue-router";


const router = useRouter();

const onClickCategory = (category_id: number) => {
  if (category_id == activeCategoryId.value) {
    activeCategoryId.value = null;
    return;
  }
  activeCategoryId.value = category_id;
}

const onChange = () => {
  // @ts-ignore
  onChangeCity(router, geographic_region.value.parent_slug);
}

</script>


<template>
  <div class="h-[200px] relative" :style="{
    // @ts-ignore
        background: `url(${geographic_region?.photo ? geographic_region?.photo : 'https://d-assets.2gis.ru/headerPhotos/almaty.jpg'}) no-repeat center center / cover`
      }">
    <div class="h-full inset-0 bg-gradient-to-t from-black to-transparent">
      <div class="p-4">
        <button v-if="geographic_region?.children && geographic_region?.children?.length > 0 && geographic_region.parent_slug == null" @click="showCity = !showCity" class="bg-[#003366] w-full px-4 py-2 rounded text-white cursor-pointer">
          Қалаларды көру
        </button>
        <div class="flex gap-2" v-else-if="geographic_region?.children && geographic_region?.children?.length > 0" >
          <button @click="onChange" class="bg-[#003366] rounded text-white px-2">
            <ChevronLeftIcon class="w-5 h-5"></ChevronLeftIcon>
          </button>
          <button @click="showCity = !showCity" class="bg-[#003366] w-full px-4 py-2 rounded text-white cursor-pointer">
            Қалаларды көру
          </button>
        </div>
        <div v-else>
          <button @click="onChange" class="bg-[#003366] rounded text-white py-2 px-4">
            <ChevronLeftIcon class="w-5 h-5"></ChevronLeftIcon>
          </button>
        </div>
        <h2 @click="showInfo = !showInfo" class="cursor-pointer mt-4 text-lg text-white flex gap-2 items-center">
          <span>{{geographic_region?.name}}</span> <span>
              <InformationCircleIcon class="w-6 h-6"></InformationCircleIcon>
            </span></h2>
        <div class="flex gap-2 mt-3 text-white text-xs">
          <div class="flex flex-col">
            <UserGroupIcon class="w-6 h-6"></UserGroupIcon>
            <div>
              <div>Халық саны</div>
              <span>{{geographic_region?.population_count}}</span>
            </div>
          </div>
          <div class="flex flex-col">
            <div>
              <HomeModernIcon class="w-6 h-6"></HomeModernIcon>
            </div>
            <div>
              <div>Тұрғын үйлер саны</div>
              <span>{{geographic_region?.dwelling_count}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="grid p-4 mt-4 items-start flex-grow-0 grid-cols-3">
    <div
        @click="onClickCategory(category.id)" class="flex flex-shrink-0 items-center p-1 cursor-pointer justify-center flex-col" v-for="category in categories">
      <div :class="{
              'bg-slate-100 text-white': activeCategoryId == category.id
            }" class="border p-3 flex-shrink-0 rounded-full">
        <ImageComponent class="h-[36px] w-[36px] flex-shrink-0" :url="category.icon" :alt="category.name"></ImageComponent>
      </div>
      <span class="mt-2 text-xs text-center">{{category.name}}</span>
    </div>
  </div>
</template>

<style scoped>

</style>