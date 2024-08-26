<script lang="ts" setup>
import {updateInfo} from "@/domain/stores.ts";
</script>
<template>
  <div class="flex flex-col gap-2">
    <div class="flex gap-1 flex-col" v-for="item in updateInfo?.infos">
    <div class="text-lg font-bold">{{item.title}}</div>
    <div class="text-2xl">{{item.value}}</div>
      <div class="grid grid-cols-2 items-center justify-between" v-if="item.children">
        <div class="flex gap-2 items-center" v-for="it in item.children">
          <div class="font-bold">{{it.title}}</div>
          <div>{{it.value}}</div>
        </div>
      </div>
  </div>
  </div>
</template>