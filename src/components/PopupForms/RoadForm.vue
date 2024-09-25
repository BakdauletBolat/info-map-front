<script setup lang="ts">

import DefaultForm from "@/components/PopupForms/DefaultForm.vue";

defineProps(['layer']);

const fieldsForEdit = [{
  key: 'title',
  type: 'text',
}, {
  key: 'description',
  type: 'text',
},
  {key: 'renovated_at', type: 'date'},
  {key: 'km', type: 'number'}]

</script>

<template>
<DefaultForm :layer="layer" :fields-for-edit="fieldsForEdit"></DefaultForm>
</template>

<style scoped>

</style>