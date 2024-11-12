<script setup lang="ts">
  import { onMounted, reactive, watch } from 'vue'
import {NInput, NInputNumber, NDatePicker} from 'naive-ui';
import {geometry} from "@/domain/stores.ts";

const form = reactive<any>({});

const update = (newForm: any) => {
  let updateP: any = {}
  Object.keys(newForm).map(key=>{
    updateP[key] = newForm[key]
  })
  geometry.value!.info = updateP;
}


watch(form, (newForm, _) => {
  update(newForm)
})

onMounted(()=>{
  if (geometry.value) {
    Object.keys(geometry.value.info).map(key=>{
    form[key] = geometry.value!.info[key]
  })
  }
 
})

const fieldsForEdit = [{
  key: 'title',
  type: 'text',
}, {
  key: 'description',
  type: 'text',
}]
</script>

<template>
  <div class="flex gap-3 flex-col p-3">
    <div v-for="field in fieldsForEdit">
      <n-input v-if="field.type == 'text'" v-model:value="form[field.key]" :placeholder="field.key"></n-input>
      <n-date-picker v-else-if="field.type == 'date'" v-model:value="form[field.key]" :placeholder="field.key"></n-date-picker>
      <n-input-number v-else-if="field.type == 'number'" v-model:value="form[field.key]" :placeholder="field.key"></n-input-number>
    </div>
  </div>
</template>

<style scoped>

</style>