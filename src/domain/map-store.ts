import {
    activeCategoryId,
    geographic_region,
    loadGeometries,
    loadRegion,
    showCity,
    toRenderGeometries
} from "@/domain/stores.ts";
import L, {Layer, Map} from "leaflet";
import {GeoJSON} from "@/domain/models.ts";
import {ref, watch} from "vue";
import "@maptiler/leaflet-maptilersdk";

export let map: Map | null = null;
export let layer: Layer | null = null;
let drawControl: any = null;
export let drawnItems: any = null;
export const createModal = ref<boolean>(false);

export const updateGeoJson = (layer: any) => {
    layer.clearLayers();
    toRenderGeometries.value.forEach(collection=>{
        layer.addData(collection)
    })

}

export const initMap = () => {
    if (map == null) {
        map = L.map('map').setView([geographic_region.value!.latitude, geographic_region.value!.longitude], geographic_region.value!.zoom);
        //@ts-ignore
        const mtLayer = L.maptilerLayer({
            apiKey: "irPaySjrW6090FVqmYLu",
            style: L.MaptilerStyle.STREETS, //optional
        }).addTo(map);
    }
}

export const mapSetView = (map: Map,x: number,y: number,z: number) => {
    map.flyTo({
        lat: x,
        lng: y
    },z)
}


const transcryptor = {
    title: 'Загаловок',
}

const renderPopup = (feature: any) => {
    let html = "<article>"
    Object.keys(feature.properties).forEach((key: string)=>{
        if (['category_id', 'show_on_map', 'icon_url'].includes(key)) {
            return;
        }
        let title = ''
        // @ts-ignore
        if (transcryptor[key] != undefined) {
            // @ts-ignore
            title = transcryptor[key];
        }
        else {
            title = key;
        }
        html += `
            <div class="flex gap-2">
            <strong>${title}:</strong>
            <div>${feature.properties[key]}</div>
            </div>
        `
    })
    html += "</article>"
    return html
}

const initGeometryObjectsLayer = () => {
    if (layer == null) {
        layer = L.geoJSON({
            type: "Feature",
            //@ts-ignore
            properties: {
                show_on_map: true
            }
        },{
            onEachFeature(feature, layer) {
                const zooMarkerPopup = L.popup().setContent(renderPopup(feature));
                layer.bindPopup(zooMarkerPopup);
            },
            filter: function(feature: GeoJSON, _: any) {
                console.log(feature)
                return feature.properties.show_on_map
            },
            pointToLayer(feature: any, lat_lng:any) {
                const icon = L.icon({
                    iconUrl: feature.properties.icon_url ? feature.properties.icon_url : 'https://cdn-icons-png.freepik.com/256/4903/4903621.png?semt=ais_hybrid',
                    iconSize: [32, 37],
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -28]
                });
                return L.marker(lat_lng, {icon: icon})
            },
        }).addTo(map!);
    }
    updateGeoJson(layer);
}

export const initData = async (slug: string, isInitDraw: boolean = false) => {
    await loadRegion(slug);
    await loadGeometries(geographic_region?.value?.id);
    initMap();
    initGeometryObjectsLayer();
    if (isInitDraw) {
        initDraw()
    }
}

export const onChangeCity = async (router: any, slug: string) => {
    await router.push({name: 'info-map-view', params: {slug: slug}});
    await initData(slug);
    showCity.value = false;
    mapSetView(map!, geographic_region.value!.latitude, geographic_region.value!.longitude, geographic_region.value!.zoom)
}

export const initDraw = () => {
    if (drawnItems == null) {
        drawnItems = new L.FeatureGroup();
        map!.addLayer(drawnItems);
    }

   if (drawControl == null) {
       // @ts-ignore
       drawControl = new L.Control.Draw({
           position: 'topright',
           edit: {
               rectangle: false,
               circle: false,
               featureGroup: drawnItems,
               polygon: {
                   showArea: true,
               }
           },
           draw: {
               rectangle: false,
               circle: false,
               polygon: {
                   showArea: true
               }
           }
       });

       // @ts-ignore
       map.on(L.Draw.Event.CREATED, function (event) {
           const layer = event.layer;
           // @ts-ignore
           layer.layerType = event.layerType;
           drawnItems.addLayer(layer);
           createModal.value = true;
       });
       // @ts-ignore
       map!.on(L.Draw.Event.EDITED, function (_) {
           createModal.value = true;
       });
   }
}

export function addControl() {
    if (drawControl != null && map != null) {
        map.addControl(drawControl);
    }
}

export function removeControl() {
    if (drawControl != null && map != null) {
        map.removeControl(drawControl);
    }
}

watch(activeCategoryId, ()=>{
    updateGeoJson(layer);
});
