import {
  activeCategoryId,
  geographic_region,
  loadGeometries,
  loadRegion,
  showCity,
  toRenderGeometries,
} from "@/domain/stores.ts";
import L, { Layer, Map } from "leaflet";
import { GeoJSON } from "@/domain/models.ts";
import {h, ref, render, watch} from "vue";
import "@maptiler/leaflet-maptilersdk";
import PopupComponent from "@/components/PopupComponent.vue";

export let map: Map | null = null;
export let layer: Layer | null = null;
let drawControl: any = null;
export let drawnItems: any = null;
export const createModal = ref<boolean>(false);

export const updateGeoJson = (layer: any) => {
  layer.clearLayers();
  toRenderGeometries.value.forEach((collection) => {
    layer.addData(collection);
  });
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
      [geographic_region.value!.latitude, geographic_region.value!.longitude],
      geographic_region.value!.zoom,
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
  html += `<a href='/geometry/editor/${feature.properties.id}'>Редактировать</a>`
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

          const zooMarkerPopup = L.popup().setContent(renderPopup(feature));
          layer.bindPopup(zooMarkerPopup);
          layer.bindTooltip(feature.properties?.title ?? "Тест", {
            permanent: true,
            direction: "bottom",
            offset: [0, -10],
            interactive: true
          });
        },
        filter: function (feature: GeoJSON, _: any) {
          return feature.properties.show_on_map;
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
  updateGeoJson(layer);
};

export const initData = async (slug: string, isInitDraw: boolean = false) => {
  await loadRegion(slug);
  await loadGeometries(geographic_region?.value?.id);
  initMap();
  initGeometryObjectsLayer();
  if (isInitDraw) {
    initDraw();
  }
};

export const onChangeCity = async (router: any, slug: string) => {
  await router.push({ name: "info-map-view", params: { slug: slug } });
  await initData(slug);
  showCity.value = false;
  mapSetView(
    map!,
    geographic_region.value!.latitude,
    geographic_region.value!.longitude,
    geographic_region.value!.zoom,
  );
};

const renderAddPopup = (layer: any) => {
  const container = document.createElement('div');
  const node = h(PopupComponent, {layer});
  render(node, container)
  return container;
};

export const initDraw = () => {
  if (drawnItems == null) {
    drawnItems = new L.FeatureGroup();
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
      layer.properties = {}
      const popUpForDraw = L.popup().setContent(renderAddPopup(layer));
      layer.bindPopup(popUpForDraw);
      layer.bindTooltip("Новая", {
        permanent: true,
        direction: "bottom",
        offset: [0, -10],
        interactive: true
      });
      drawnItems.addLayer(layer);
    });
    // @ts-ignore
    map!.on(L.Draw.Event.EDITED, function (_) {
    });
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
