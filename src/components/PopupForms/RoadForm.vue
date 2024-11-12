<script setup lang="ts">

import DefaultForm from "@/components/PopupForms/DefaultForm.vue";

defineProps(['layer']);

const fieldsForEdit = [{
  key: 'title',
  placeholder: 'Загаловок',
  type: 'text',
}, {
  key: 'description',
  placeholder: "Описание",
  type: 'text',
},
  {key: 'renovated_at', type: 'date', placeholder: "Последняя дата ремонта"},
  {key: 'km', type: 'number', placeholder: "Протяженность"},
  {
    key: 'type_road',
    placeholder: "Тип дороги",
    type: 'select',
    options: ['Тасжол', 'Жол', 'Асфальт'].map((value: string)=> {return {
      "label": value,
      "value": value}
    })}]
</script>

<template>
<DefaultForm :layer="layer" :fields-for-edit="fieldsForEdit"></DefaultForm>
</template>

<style scoped>

</style>
