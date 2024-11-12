<script setup lang="ts">
  import { onMounted, reactive, watch } from 'vue'
import {NInput, NInputNumber, NDatePicker, NSelect} from 'naive-ui';

const props = defineProps(['layer', 'fieldsForEdit']);

const form = reactive<any>({});

const update = (newForm: any) => {
  let updateP: any = {}
  Object.keys(newForm).map(key=>{
    updateP[key] = newForm[key]
  })
  console.log()
  if (newForm.title != undefined) {
    props.layer.getTooltip().setContent(newForm.title)
  }
  props.layer.properties = updateP;
}

watch(form, (newForm, _) => {
  update(newForm)
})

onMounted(()=>{
  Object.keys(props.layer.properties).map(key=>{
    form[key] = props.layer.properties[key]
  })
})


</script>

<template>
  <div class="flex gap-3 flex-col p-3">
    <div v-for="field in fieldsForEdit">
      <n-input v-if="field.type == 'text'" v-model:value="form[field.key]" :placeholder="field.placeholder"></n-input>
      <n-select v-if="field.type == 'select'" v-model:value="form[field.key]" :placeholder="field.placeholder" :options="field.options"></n-select>
      <n-date-picker v-else-if="field.type == 'date'" v-model:value="form[field.key]" :placeholder="field.placeholder"></n-date-picker>
      <n-input-number v-else-if="field.type == 'number'" v-model:value="form[field.key]" :placeholder="field.placeholder"></n-input-number>
    </div>
  </div>
</template>

<style scoped>

</style>