import {
    activeCategoryId,
    geographic_region, geometries, geometry,
    loadGeometries, loadGeometry,
    loadRegion,
    showCity,
    toRenderGeometries,
} from "@/domain/stores.ts";
import L, { Layer, Map } from "leaflet";
import { GeoJSON } from "@/domain/models.ts";
import { ref, watch } from "vue";
import "@maptiler/leaflet-maptilersdk";

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
            [43.03438595653483,69.37031728244519],
            15
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

const transcryptor = {
    title: "Тақырып",
    description: "Сипаттама",
};

const renderPopup = (feature: any) => {
    let html = "<article>";
    Object.keys(feature.properties).forEach((key: string) => {
        if (["category_id", "show_on_map", "icon_url"].includes(key)) {
            return;
        }
        let title = "";
        // @ts-ignore
        if (transcryptor[key] != undefined) {
            // @ts-ignore
            title = transcryptor[key];
        } else {
            title = key;
        }
        html += `
            <div class="flex gap-2">
            <strong>${title}:</strong>
            <div>${feature.properties[key]}</div>
            </div>
        `;
    });
    html += "</article>";
    return html;
};

const generateColor = (renovated_at: string) => {
    const date = new Date(renovated_at);
    const greenTime = 157788000000;
    const yellowTime = 63072000000;
    const nowDate = Date.now();
    //@ts-ignore
    const diff = nowDate - date;
    if (diff < yellowTime) {
        return "green";
    }
    if (diff > yellowTime && diff < greenTime) {
        return "yellow";
    }

    return "red";
};

const initGeometryObjectsLayer = () => {
    if (layer == null) {
        layer = L.geoJSON(
            {
                type: "Feature",
                //@ts-ignore
                properties: {
                    show_on_map: true,
                },
            },
            {
                style(layer: any) {
                    let color = "red";
                    if (layer.properties?.renovated_at != undefined) {
                        color = generateColor(layer.properties.renovated_at);
                    }
                    if (layer.geometry.type == "LineString") {
                        return {
                            weight: 3,
                            color: color,
                        };
                    }
                    return {
                        weight: 1,
                        color: "#B2ABF2",
                    };
                },
                onEachFeature(feature, layer) {
                    // if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
                    //     layer.editing.enable(); // Включаем редактирование
                    //     layer.on('edit', function() {
                    //         console.log(feature.properties.name + ' was edited!');
                    //     });
                    // }
                    const zooMarkerPopup = L.popup().setContent(renderPopup(feature));
                    layer.bindPopup(zooMarkerPopup);
                    layer.bindTooltip(feature.properties?.title ?? "Тест", {
                        permanent: true,
                        direction: "bottom",
                        offset: [0, -10],
                    });
                },
                pointToLayer(feature: any, lat_lng: any) {
                    const icon = L.icon({
                        iconUrl: feature.properties.icon_url
                            ? feature.properties.icon_url
                            : "https://cdn-icons-png.freepik.com/256/4903/4903621.png?semt=ais_hybrid",
                        iconSize: [32, 37],
                        iconAnchor: [16, 37],
                        popupAnchor: [0, -28],
                    });
                    return L.marker(lat_lng, { icon: icon });
                },
            },
        ).addTo(map!);
    }
};

export const initData = async (region_id: number) => {
    await loadGeometry(region_id);
    initMap();
    initGeometryObjectsLayer();
    initDraw();
};


const negative = (coors) => {
    return coors.map(coor=>[coor[1], coor[0]]);
}
export const initDraw = () => {
    if (drawnItems == null) {
        drawnItems = new L.FeatureGroup();
        //@ts-ignore
        geometry.value?.geometry.features.map(feature=>{
            console.log(feature.geometry.type, feature.geometry.coordinates)
            if (feature.geometry.type == 'LineString') {
                const a = new L.polyline(negative(feature.geometry.coordinates), {}).addTo(map);
                console.log(a);
                drawnItems.addLayer(a);
            }
        })
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
