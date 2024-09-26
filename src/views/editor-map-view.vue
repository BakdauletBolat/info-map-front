<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";
import "vue-select/dist/vue-select.css";
import "leaflet-draw";
import SidebarComponent from "@/components/SidebarComponent.vue";
import {
    addControl,
    createModal,
    drawnItems,
    initData,
    layer,
    map,
    mapSetView,
    removeControl,
    updateGeoJson,
} from "@/domain/map-store.ts";
//@ts-ignore
import VueSelect from "vue-select";
import {
  categories,
  formForCreate,
  geographic_region, geometry, isLoadingGeometries,
  loadCategories,
  loadGeometries,
} from "@/domain/stores.ts";
import ModalComponent from "@/components/ModalComponent.vue";
import ImageComponent from "@/components/ImageComponent.vue";
import { ICategory } from "@/domain/models.ts";
import InputComponent from "@/components/InputComponent.vue";
import instance from "@/api/instance.ts";
import {useMessage, NDatePicker, NButton, NSpin} from "naive-ui";
import {getGeometryCollection} from "@/utils.ts";

const route = useRoute();
const modal = ref<boolean>(true);
const message = useMessage();
const selectedCity = ref<any | null>(null);
const showCategory = ref<boolean>(false);
const category = ref<ICategory | null>(null);

const getAllRegions = (region: any, items: any) => {
    if (region == undefined) {
        return;
    }
    if (region.children && region.children?.length > 0) {
        items.push({
            label: region.name,
            code: region.id,
            latitude: region.latitude,
            longitude: region.longitude,
            zoom: region.zoom,
        });
        region.children.forEach((item: any) => {
            getAllRegions(item, items);
        });
    } else {
        items.push({
            label: region.name,
            code: region.id,
            latitude: region.latitude,
            longitude: region.longitude,
            zoom: region.zoom,
        });
        return;
    }
};
const isLoading = ref<boolean>(false);

const options = computed(() => {
    const regions: any = [];
    getAllRegions(geographic_region.value, regions);
    return regions;
    // if (geographic_region.value?.children)
});

const fieldsForCreate = [
    {
        value: "title",
        placeholder: "Загаловок",
    },
    {
        value: "description",
        placeholder: "Описание",
    }
];

watch(selectedCity, (n, _) => {
    if (n != null) {
        showCategory.value = true;
    }
    mapSetView(
        map!,
        selectedCity.value.latitude,
        selectedCity.value.longitude,
        selectedCity.value.zoom,
    );
});

watchEffect(() => {
    if (selectedCity.value != null && category.value != null) {
        addControl();
    } else {
        removeControl();
    }
});

const onClickCategory = async (selectedCategory: ICategory) => {
    category.value = selectedCategory;
    await loadGeometries(geographic_region.value.id, [selectedCategory.id]);
    updateGeoJson(layer);
    showCategory.value = false;
};


const onSuccessSave = async () => {
    drawnItems.clearLayers();
    Object.keys(formForCreate).forEach((item) => {
        formForCreate[item] = "";
    });
    await loadGeometries(geographic_region?.value?.id, [category.value.id]);
    updateGeoJson(layer);
    createModal.value = false;
    message.success("Успешно добавлено!");
};

const onSaveGeometryObject = () => {
    isLoading.value = true;
    const layers = drawnItems._layers;
    if (category.value == null) {
        return;
    }
    instance
        .post("/api/geometries/", {
            info: formForCreate,
            region_id: selectedCity.value.code,
            category_id: category.value!.id,
            geometry: getGeometryCollection(layers),
        })
        .then((_) => {
            onSuccessSave();
        })
        .catch((e) => {
            console.log(e);
            message.error("Ошибка при сохранений! " + e.toString());
        })
        .finally(() => (isLoading.value = false));
};
onMounted(() => {
    loadCategories();
    fieldsForCreate.forEach((item) => {
        if (item.type == "date") {
            formForCreate[item.value] = 1183135260000;
        } else {
            formForCreate[item.value] = "";
        }
    });
    initData(route.params.slug.toString(), true, []);
});
</script>

<template>
  <n-spin :show="isLoadingGeometries">
    <main class="flex w-full min-h-screen">
        <SidebarComponent class="flex-shrink-0" v-model="modal">
            <div class="p-4">
                <h2>Выбрать город</h2>
                <VueSelect
                    class="mt-4"
                    v-model="selectedCity"
                    title="Выбрать город"
                    :options="options"
                ></VueSelect>
                <div v-if="category" class="mt-4">
                    <div
                        class="flex flex-shrink-0 p-1 cursor-pointer justify-center flex-col"
                    >
                        <div
                            @click="showCategory = true"
                            class="border p-3 flex gap-2 items-center flex-shrink-0 rounded-full"
                        >
                            <ImageComponent
                                class="h-[36px] w-[36px] flex-shrink-0"
                                :url="category.icon"
                                :alt="category.name"
                            ></ImageComponent>
                            <span class="text-center">{{ category.name }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarComponent>
        <ModalComponent class="z-[999999]" v-model="createModal">
            <div class="p-4 flex flex-col gap-2">
                <div v-for="item in fieldsForCreate">
                    <div v-if="item.type == 'date'">
                        <NDatePicker
                            v-model:value="formForCreate[item.value]"
                            type="date"
                        />
                    </div>
                    <InputComponent
                        v-else
                        v-model="formForCreate[item.value]"
                        :placeholder="item.placeholder"
                    ></InputComponent>
                </div>
                <button
                    :class="{
                        'bg-gray-500': isLoading,
                    }"
                    :disabled="isLoading"
                    class="mt-4 w-full bg-[#003366] text-white p-2 rounded-lg"
                    @click="onSaveGeometryObject"
                >
                    Сохранить
                </button>
            </div>
        </ModalComponent>
        <ModalComponent class="z-[999999]" v-model="showCategory">
            <h2 class="p-5 text-2xl">Выбрать тип обьекта</h2>
            <div class="grid p-4 mt-4 items-start flex-grow-0 grid-cols-3">
                <div
                    @click="onClickCategory(category)"
                    class="flex flex-shrink-0 items-center p-1 cursor-pointer justify-center flex-col"
                    v-for="category in categories"
                >
                    <div class="border p-3 flex-shrink-0 rounded-full">
                        <ImageComponent
                            class="h-[36px] w-[36px] flex-shrink-0"
                            :url="category.icon"
                            :alt="category.name"
                        ></ImageComponent>
                    </div>
                    <span class="mt-2 text-xs text-center">{{
                        category.name
                    }}</span>
                </div>
            </div>
        </ModalComponent>
        <section class="w-full">
          <div class="w-full absolute bottom-5 z-[909999] right-0 flex justify-end gap-3 p-3">
            <n-button :disabled="isLoading" :loading="isLoading" type="primary" @click="()=>onSaveGeometryObject()">Сохранить</n-button>
            <n-button type="info" @click="()=>createModal = true">Открыть форму</n-button>
          </div>
            <div :style="{ width: '100%', height: '100%' }" id="map"></div>
        </section>
    </main>
  </n-spin>
</template>

<style scoped></style>
