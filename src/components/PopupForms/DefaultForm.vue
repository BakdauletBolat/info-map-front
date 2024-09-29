<script setup lang="ts">
import {onMounted, reactive} from "vue";
import {NInput, NInputNumber, NDatePicker, NButton} from 'naive-ui';

const props = defineProps(['layer', 'fieldsForEdit']);

const form = reactive<any>({});

const update = () => {
  let updateP: any = {}
  Object.keys(form).map(key=>{
    updateP[key] = form[key]
  })
  props.layer.properties = updateP;
}

onMounted(()=>{
  Object.keys(props.layer.properties).map(key=>{
    form[key] = props.layer.properties[key]
  })
})


</script>

<template>
  <div class="flex gap-3 flex-col p-3">
    <div v-for="field in fieldsForEdit">
      <n-input v-if="field.type == 'text'" v-model:value="form[field.key]" :placeholder="field.key"></n-input>
      <n-date-picker v-else-if="field.type == 'date'" v-model:value="form[field.key]" :placeholder="field.key"></n-date-picker>
      <n-input-number v-else-if="field.type == 'number'" v-model:value="form[field.key]" :placeholder="field.key"></n-input-number>
    </div>
    <n-button @click="update">Обновить</n-button>
  </div>
</template>

<style scoped>

</style>