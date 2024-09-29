import {
    activeCategoryId,geometry,
    loadGeometry
} from "@/domain/stores.ts";

import L, { Layer, Map } from "leaflet";
import {ref, watch, render, h} from "vue";
import "@maptiler/leaflet-maptilersdk";
import PopupComponent from "@/components/PopupComponent.vue";
import instance from "@/api/instance.ts";
import {getGeometryCollection} from "@/utils.ts";

export let map: Map | null = null;
export let layer: Layer | null = null;
let drawControl: any = null;
export let drawnItems: any = null;
export const createModal = ref<boolean>(false);

export const updateGeoJson = (layer: any) => {
    layer.clearLayers();
    layer.addData(geometry.value?.geometry);
};

export const initMap = () => {
    if (map == null) {
        //@ts-ignore
        const mtLayer = L.maptilerLayer({
            attribution: "",
            apiKey: "irPaySjrW6090FVqmYLu",
            //@ts-ignore
            style: L.MaptilerStyle.STREETS, //optional
        });
        const osmHOT = L.tileLayer(
            "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
            {
                attribution: "",
                maxZoom: 20,
                subdomains: ["mt0", "mt1", "mt2", "mt3"],
            },
        );

        var baseMaps = {
            Спутник: osmHOT,
            Негізгі: mtLayer,
        };

        map = L.map("map", {
            layers: [mtLayer],
        }).setView(
            [geometry.value!.region.latitude,geometry.value!.region.longitude],
            geometry.value!.region.zoom
        );
        //@ts-ignore
        map?.attributionControl.remove();
        L.control.layers(baseMaps).addTo(map);
        L.control
            .attribution({
                prefix: false, // Remove default "Leaflet" attribution
            })
            .addAttribution(
                'Бәйдібек ауданы <a href="https://widget.bolatb.kz/info/baidybek_d" target="_blank">B-Maps</a>',
            )
            .addTo(map);
    }
};

export const mapSetView = (map: Map, x: number, y: number, z: number) => {
    map.flyTo(
        {
            lat: x,
            lng: y,
        },
        z,
    );
};

const renderPopup = (layer: any) => {
    const container = document.createElement('div');
    const node = h(PopupComponent, {layer});
    render(node, container)
    return container;
};


export const initData = async (region_id: number) => {
    await loadGeometry(region_id);
    initMap();
    initDraw();
};


const negative = (coors: any) => {
    return coors.map((coor: any)=>[coor[1], coor[0]]);
}

const negativeOne = (coors: any) => {
    return [coors[1], coors[0]];
}

const initDrawerObjects = (layer: L.FeatureGroup) => {
     //@ts-ignore
    geometry.value?.geometry!.features!.map((feature: any)=>{
        console.log(feature.geometry.type, feature.geometry)
        if (feature.geometry.type == 'LineString') {
            //@ts-ignore
            const lineString = new L.polyline(negative(feature.geometry.coordinates), {}).addTo(map);
            lineString.layerType = "polyline";
            lineString.properties = feature.properties;
            const zooMarkerPopup = L.popup().setContent(renderPopup(lineString));
            lineString.bindPopup(zooMarkerPopup);
            lineString.bindTooltip(feature.properties?.title ?? "Тест", {
                permanent: true,
                direction: "bottom",
                offset: [0, -10],
                interactive: true
            });
            layer.addLayer(lineString);
        }
        if (feature.geometry.type == 'Point') {
            const icon = L.icon({
                iconUrl: feature.properties.icon_url
                    ? feature.properties.icon_url
                    : "https://cdn-icons-png.freepik.com/256/4903/4903621.png?semt=ais_hybrid",
                iconSize: [32, 37],
                iconAnchor: [16, 37],
                popupAnchor: [0, -28],
            });
             //@ts-ignore
            const pointLayer = new L.marker(negativeOne(feature.geometry.coordinates), {icon: icon}).addTo(map);
            pointLayer.layerType = "marker";
            pointLayer.properties = feature.properties;
            const zooMarkerPopup = L.popup().setContent(renderPopup(pointLayer));
            pointLayer.bindPopup(zooMarkerPopup);
            layer.addLayer(pointLayer);
        }

        if (feature.geometry.type == 'Polygon') {

             //@ts-ignore
            const polygonLayer = new L.polygon(negative(feature.geometry.coordinates[0]), {}).addTo(map);
            polygonLayer.layerType = "polygon";
            polygonLayer.properties = feature.properties;
            const zooMarkerPopup = L.popup().setContent(renderPopup(polygonLayer));
            polygonLayer.bindPopup(zooMarkerPopup);
            polygonLayer.bindTooltip(feature.properties?.title ?? "Тест", {
                permanent: true,
                direction: "bottom",
                offset: [0, -10],
                interactive: true
            });
            layer.addLayer(polygonLayer);
        }

    })
}
export const initDraw = () => {
    if (drawnItems == null) {
        drawnItems = new L.FeatureGroup();
        initDrawerObjects(drawnItems);
        map!.addLayer(drawnItems);
    }

    if (drawControl == null) {
        // @ts-ignore
        drawControl = new L.Control.Draw({
            position: "topright",
            edit: {
                rectangle: false,
                circle: false,
                featureGroup: drawnItems,
                polygon: {
                    showArea: true,
                },
            },
            draw: {
                rectangle: false,
                circle: false,
                polygon: {
                    showArea: true,
                },
            },
        });

        // @ts-ignore
        map.on(L.Draw.Event.CREATED, function (event) {
            const layer = event.layer;
            // @ts-ignore
            layer.layerType = event.layerType;
            const zooMarkerPopup = L.popup().setContent(renderPopup(null));
            layer.bindPopup(zooMarkerPopup);
            layer.bindTooltip("Новая", {
                permanent: true,
                direction: "bottom",
                offset: [0, -10],
                interactive: true
            });
            drawnItems.addLayer(layer);
            createModal.value = true;
        });
        // @ts-ignore
        map!.on(L.Draw.Event.EDITED, function (_) {
            createModal.value = true;
        });
        addControl()
    }
};

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

watch(activeCategoryId, () => {
    updateGeoJson(layer);
});


export const save = async (id: string) => {
    const geometriesBody = getGeometryCollection(drawnItems._layers);
    return instance.put("/api/geometries/"+id+"/", {
        info: geometry.value?.info,
        geometry: geometriesBody
    }).then((_) => instance.get("/api/geometries/"+id+"/").then(res=>{
        geometry.value = res.data;
    }));
}

