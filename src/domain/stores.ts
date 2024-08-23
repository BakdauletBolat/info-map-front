import {computed, reactive, ref, watch} from "vue";
import {ICategory, IGeographicRegion, IGeographicResponse, IGeometryObject, IGetUpdateInfo} from "./models.ts";
import apiInstance from "../api/instance.ts";

export const geographic_region = ref<IGeographicRegion | null>();
export const categories = ref<ICategory[]>([]);
export const geometries = ref<IGeometryObject[]>([]);

export const activeCategoryId = ref<number | null>(null);

export const showCity = ref<boolean>(false);
export const showInfo = ref<boolean>(false);
export const isLoadingRegion = ref<boolean>(false);
export const formForCreate = reactive<any>({});
export const updateInfo = ref<IGetUpdateInfo>();
export const toRenderGeometries = computed(()=>{
    return geometries.value.map(item=>{
        let l = item.geometry;
        //@ts-ignore
        l.features.forEach(c=>{
            c.properties.icon_url = item.category.icon;
            c.properties.category_id = item.category.id;
            if (activeCategoryId.value == null) {
                c.properties.show_on_map = true;
            }
            else {
                c.properties.show_on_map = item.category.id == activeCategoryId.value;
            }
        })

        return l;
    })
});



export const loadRegion = async (slug: string) => {
    isLoadingRegion.value = true;
    await apiInstance.get<IGeographicResponse>('/api/region/'+slug)
        .then(res=>{
            geographic_region.value = res.data.region;
        }).finally(()=>{
            isLoadingRegion.value = false;
        })
}

export const authUser = async (body: object) => {
    return apiInstance.post('/auth/token/', body);
}

export const loadGeometries = async (region_id: number | undefined) => {
    let url = '/api/geometries?geographic_region_id='+region_id;
    await apiInstance.get<IGeometryObject[]>(url).then(res=>{
        geometries.value = res.data
    });
}

export const loadCategories = () => {
    apiInstance.get<ICategory[]>('/api/categories')
        .then((res)=>{
            categories.value = res.data;
        })
}

export const loadUpdateInfo = (category_id: string, region_slug: string) => {
    apiInstance.get<IGetUpdateInfo>(`/api/region/get_update_info?category_id=${category_id}&region_slug=${region_slug}`).then(res=>{
        updateInfo.value = res.data;
    })
}

//#todo Создать апи по получение региона
export const loadRegionById = () => {
    return ''
}

export const setGeographicRegion = (region: IGeographicRegion) => {
    geographic_region.value = region;
}


export const token = ref(localStorage.getItem("token"));

// Watch for changes in localStorage
watch(token, (newValue: any) => {
    if (newValue) {
        localStorage.setItem("token", newValue);
    } else {
        localStorage.removeItem("token");
    }
});

// Function to update the authentication status
export function updateAuthenticationStatus(v: string) {
    token.value = v;
}

export const isAuthenticated = computed(()=>{
    return token.value != null
})