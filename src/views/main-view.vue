<template>
  <main class="flex flex-col min-h-screen w-full items-center justify-center">
    <ImageComponent class="w-[100px] h-[100px]" :url="InProgressIcon"></ImageComponent>
    <h2 class="text-lg mt-4 font-medium">Құрметті пайдаланушылар!</h2>
    <div class="px-4">
      <p class="text-sm">Біз сіздерге жақын арада іске қосылатын жаңа географиялық қызметімізді қуана хабарлаймыз. Қазіргі уақытта сервисіміз әзірлену үстінде. Біз сіздерге сапалы және ыңғайлы қызмет көрсету үшін бар күшімізді салудамыз.</p>
      <p class="text-sm mt-2">Бізбен бірге болыңыздар, жаңалықтарды жіберіп алмаңыздар!</p>
      <p class="text-sm mt-4">Ізгі тілекпен, </p>
      <span class="text-sm font-medium">B-apps</span>
    </div>
  </main>
</template>
<script lang="ts" setup>
import ImageComponent from "@/components/ImageComponent.vue";
import InProgressIcon from "@/assets/in-progress-warning-svgrepo-com.svg";
</script>