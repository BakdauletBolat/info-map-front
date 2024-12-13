<template>
  <article class="w-[300px]">
    <div v-if="geometry">
      <div v-if="geometry.category.id == 1">
        <RoadForm :layer="layer"></RoadForm>
      </div>
      <div v-else>
        <DefaultForm :layer="layer" :fields-for-edit="defaultEditFields"></DefaultForm>
      </div>
    </div>
    <div v-else>
      <road-form :layer="layer"></road-form>
    </div>
  </article>
</template>

<script lang="ts" setup>
  import {geometry} from "@/domain/stores.ts";
  import RoadForm from "@/components/PopupForms/RoadForm.vue";
  import DefaultForm from "@/components/PopupForms/DefaultForm.vue";

  const defaultEditFields = [{
    key: 'title',
    placeholder: 'Загаловок',
    type: 'text',
  },
    {
      key: 'description',
      placeholder: 'Описание',
      type: 'text',
    }]

  defineProps(['layer'])
</script>
