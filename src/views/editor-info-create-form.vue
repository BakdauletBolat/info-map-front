<template>
  <header class="p-2 shadow-sm">
    <div class="flex gap-2 container px-4 mx-auto">
      <router-link :to="{
        name: 'editor-info-create-welcome',
      }">
        <n-button>Назад</n-button>
      </router-link>
      <h2 class="text-2xl">Создание информаций</h2>
    </div>
  </header>
  <main class="bg-sky-50 min-h-screen">
    <section class="container py-4 px-4 mx-auto h-full grid grid-cols-[200px_1fr]">
      <aside>
        <n-descriptions label-placement="top" :column="1">
          <n-descriptions-item label="Насаленный пункт">
            {{ updateInfo?.region_name }}
          </n-descriptions-item>
          <n-descriptions-item label="Категория">
            {{ updateInfo?.category_name }}
          </n-descriptions-item>
        </n-descriptions>
      </aside>
      <main>
        <div class="p-4 font-bold text-xl">Основные данные</div>
        <div>
          <quill-editor contentType="html" v-model:content="description" class="bg-white" toolbar="full" theme="snow"/>
        </div>
        <div class="p-4 font-bold text-xl">Данные по категориям</div>
        <n-spin :show="isLoadingRegion">
          <n-dynamic-input
              v-model:value="pairs"
              preset="pair"
              key-placeholder="Название ключа"
              value-placeholder="Название значений"
              :on-create="createPair"
          >
            <template #default="{ value, index }">
              <div class="flex gap-2">
                <div class="flex flex-col gap-2 justify-center">
                  <div class="flex items-center gap-2">
                    <n-input
                        v-model:value="value.key"
                        placeholder="Название ключа"
                    />
                    <n-input
                        v-model:value="value.value"
                        placeholder="Название значений"
                    />
                  </div>
                  <h2 v-if="pairs[index].children.length > 0" class="font-bold text-2xl">{{ value.key }} - {{ value.value }}</h2>
                  <div v-if="pairs[index].children.length > 0">
                    <n-dynamic-input
                        v-model:value="pairs[index].children"
                        preset="pair"
                        key-placeholder="Название дочернего ключа"
                        value-placeholder="Название дочернего значения"
                        :createable="true"
                    />
                  </div>
                </div>
                <n-button @click="addChild(index)" size="small">Добавить дочерний элемент</n-button>
              </div>
            </template>
          </n-dynamic-input>
        </n-spin>
        <n-button :loading="isLoading" type="primary" class="mt-4" @click="handleCreate">Создать / Обновить</n-button>
      </main>
    </section>
  </main>
</template>
<script lang="ts" setup>
import {NButton, NDescriptions, NDescriptionsItem, NDynamicInput, NInput, useMessage, NSpin} from "naive-ui";
import {onMounted, ref, watch} from "vue";
import apiInstance from "@/api/instance.ts";
import {useRoute} from "vue-router";
import {updateInfo, isLoadingRegion, loadUpdateInfo} from "@/domain/stores.ts";
import {QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';


const route = useRoute();
const message = useMessage()
const description = ref('');
const pairs = ref([{key: '', value: '', children: [{key: '', value: ''}]}]);

const isLoading = ref(false);

watch(updateInfo, (state) => {
  if (state != undefined) {
    pairs.value = state!.infos.map(item => {
      return {
        key: item.title,
        value: item.value,
        children: item.children.map((nitem:any) => {
          return {
            key: nitem.title,
            value: nitem.value
          }
        })
      }
    })
    description.value = state.description
  }

})


onMounted(() => {
  const categoryId = route.params.categoryId.toString()
  loadUpdateInfo(categoryId, route.params.regionId.toString());
  pairs.value[0].children = getByCategoryChildren(parseInt(categoryId));
})


function getByCategoryChildren(categoryId: number) {
  if (categoryId == 1 && pairs.value.length > 0) {
    return [
      {
        key: 'Жалпы ұзындығы, км',
        value: ''
      },
      {
        key: 'Асфальт-бетонды, шқ. ',
        value: ''
      },
      {
        key: 'қиыршықтас, шқ.',
        value: ''
      },
      {
        key: 'топырақ , шқ.',
        value: ''
      }
    ]
  }

  return []
}


function createPair(_: number) {
  const children = getByCategoryChildren(parseInt(route.params.categoryId.toString()));
  return {
    key: '',
    value: '',
    children: children
  }
}

function addChild(parentIndex: number) {
  if (!pairs.value[parentIndex].children) {
    pairs.value[parentIndex].children = [{key: '', value: ''}];
  } else {
    pairs.value[parentIndex].children.push({key: '', value: ''});
  }
}

function handleCreate() {
  isLoading.value = true;
  const infos = pairs.value.map(item => {
    return {
      title: item.key,
      value: item.value,
      children: item.children.map(item => {
        {
          return {
            title: item.key,
            value: item.value
          }
        }
      })
    }
  })
  const body = {
    information_keys: infos,
    category_id: route.params.categoryId,
    description: description.value
  }
  apiInstance.post(`/api/region/${updateInfo.value?.region_id}/update_info/`, body).then(_ => {
    message.success("Успешно");
  }).catch(e => {
    message.error("Что то не так " + e.toString());
  }).finally(() => {
    isLoading.value = false;
  })
}
</script>