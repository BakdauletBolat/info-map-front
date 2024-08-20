<script setup lang="ts">
import {IGeographicRegion} from "@/domain/models.ts";
import {geographic_region, showInfo} from "@/domain/stores.ts";
import {ExclamationCircleIcon, ChevronUpIcon} from "@heroicons/vue/24/outline";
import {onChangeCity} from "@/domain/map-store.ts";
import {useRouter} from "vue-router";
import ImageComponent from "@/components/ImageComponent.vue";
import HouseSVG from '@/assets/house-svgrepo-com.svg';
import PeopleSVG from '@/assets/people-29-svgrepo-com.svg';
import {Disclosure, DisclosurePanel, DisclosureButton} from '@headlessui/vue'

defineProps<{
  region: IGeographicRegion
}>();


const router = useRouter();

const getStyle = (level: number) => {
  switch (level) {
    case 0:
      return {
        color: 'black',
        fontSize: '18px'
      }
    case 1:
      return {
        color: 'black',
        fontSize: '16px',
      }
    case 2:
      return {
        color: 'black',
        fontSize: '14px',
      }
    case 3:
      return {
        color: 'black',
        fontSize: '12px',
      }
  }
}

const getStyleContainer = (level: number) => {
  switch (level) {
    case 0:
      return {
        marginLeft: '0px',
      }
    case 1:
      return {
        marginLeft: '8px',
      }
    case 2:
      return {
        marginLeft: '16px',
      }
    case 3:
      return {
        marginLeft: '32px',
      }
  }
}


</script>
<template>
  <div class="mt-4" :style="getStyleContainer(region.level)">
    <div @click="()=>{
      onChangeCity(router, region.slug);
      showInfo = false;
    }" class="flex gap-2 cursor-pointer items-center">
      <h2 :style="getStyle(region.level)" class="font-bold !text-blue-900">{{ region?.name }}</h2>
      <ExclamationCircleIcon class="w-6 h-6 !text-blue-900  "></ExclamationCircleIcon>
    </div>
    <div>
      <div class="flex gap-2 mt-3 text-xs">
        <div class="flex flex-col">
          <ImageComponent :url="PeopleSVG" class="w-6 h-6"></ImageComponent>
          <div>
            <div>Халық саны</div>
            <span>{{ region?.population_count }}</span>
          </div>
        </div>
        <div class="flex flex-col">
          <div>
            <ImageComponent :url="HouseSVG" class="w-6 h-6"></ImageComponent>
          </div>
          <div>
            <div>Тұрғын үйлер саны</div>
            <span>{{ region?.dwelling_count }}</span>
          </div>
        </div>

      </div>
       <Disclosure v-if="region?.info" v-slot="{ open }">
        <DisclosureButton
          class="flex mt-4 w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75"
        >
          <span>Акпарттар</span>
          <ChevronUpIcon
            :class="open ? 'rotate-180 transform' : ''"
            class="h-5 w-5 text-purple-500"
          />
        </DisclosureButton>
        <DisclosurePanel class="px-4 pb-2 pt-4 text-sm text-gray-500">
         <div class="flex flex-col gap-3">
          <div class="flex justify-between w-full items-center" v-for="item in region?.info">
            <div class="font-medium">{{item.title}}</div>
            <div>{{item.value}}</div>
          </div>
        </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
  </div>
  <div v-if="region?.children && region?.children?.length > 0" class="" v-for="child in region?.children">
    <GeographicInfoComponent :region="child"></GeographicInfoComponent>
  </div>
</template>

<style scoped>

</style>