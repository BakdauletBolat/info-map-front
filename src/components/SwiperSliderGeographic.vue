<script setup lang="ts">
import {register} from 'swiper/element/bundle';
import {IGeographicRegion} from "@/domain/models.ts";
import ImageComponent from "@/components/ImageComponent.vue";
import {onMounted} from "vue";
import ExampleImage from '@/assets/example.jpeg';
import {ArrowLongLeftIcon, ArrowLongRightIcon} from "@heroicons/vue/24/outline";

register();

defineProps<{
  region: IGeographicRegion
}>()

const emit = defineEmits(['onChange']);

let slider: any = null;

onMounted(()=>{
  slider = document.querySelector('swiper-container');
  slider.addEventListener('swiperslidechange', (_: any) => {
    console.log('slide changed', slider);
  });
})

function nextSlide() {
  if (slider != null) {
    slider.swiper.slideNext();
  }
}

function prevSlide() {
  if (slider != null) {
    slider.swiper.slidePrev();
  }
}

const onClickSlide = (region: IGeographicRegion) => {
  emit('onChange', region.slug);
}

</script>

<template>
  <div v-if="region?.children" class="min-h-screen flex justify-center items-center">
    <swiper-container
        class="w-full"
        :mousewheel="true"
        :slides-per-view="1"
        :space-between="100"
        :centeredSlides="true"
        :breakpoints="{
          320: {
            slidesPerView: 1,
            spaceBetween: 0
          },
          480: {
            slidesPerView: 1
          },
          700: {
            slidesPerView: 3
          }
        }"
        :effect="'coverflow'"
        :coverflowEffect="{
        rotate: 20,
        slideShadows: false,
        }"

        :slideActiveClass="'custom-active'"
    >
      <swiper-slide
          class="px-4"
          :data-latitude="child.latitude"
          :data-longitude="child.longitude"
          v-for="child in region.children">
        <div  @click="onClickSlide(child)" class="min-w-[350px] cursor-pointer relative bg-white rounded overflow-hidden">
          <ImageComponent class="w-full  h-[350px]" :alt="child.name" :url="child.photo ? child.photo : ExampleImage"></ImageComponent>
          <div class="absolute top-0 bg-gradient-to-t from-black to-transparent w-full  h-full"></div>
          <div class="absolute top-0 text-white text-2xl w-full flex justify-center items-center h-full z-[1]">{{child.name}}</div>
        </div>
      </swiper-slide>
    </swiper-container>
    <div class="flex absolute bottom-5 gap-4 z-[9999] text-white navigations">
      <div class="cursor-pointer" @click="prevSlide"><ArrowLongLeftIcon class="w-9 h-9"></ArrowLongLeftIcon></div>
      <div class="cursor-pointer" @click="nextSlide"><ArrowLongRightIcon class="w-9 h-9"></ArrowLongRightIcon></div>
    </div>
  </div>
</template>

<style scoped>

.custom-active {
  transform: scale(1);
}
</style>