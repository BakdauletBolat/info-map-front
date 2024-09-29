export const getPolylineType = (type: string) => {
    switch (type) {
        case "marker":
            return "Point";
        case "polyline":
            return "LineString";
        case "polygon":
            return "Polygon";
    }
    return "";
};

export const getCoordinates = (layer: any) => {
    if (layer.layerType == "marker") {
        return [layer._latlng.lng, layer._latlng.lat];
    }
    if (layer.layerType == "polygon") {
        const coors: any[] = [];
        layer._latlngs.forEach((layers: any) => {
            layers.forEach((layer: any) => {
                coors.push([layer.lng, layer.lat]);
            });
        });
        return [coors];
    }
    const coors: any[] = [];
    layer._latlngs.forEach((layer: any) => {
        coors.push([layer.lng, layer.lat]);
    });
    return coors;
};

export const getGeometryCollection = (layers: any) => {
    let geometriesBody = {
        features: [],
    };


    Object.keys(layers).forEach((key) => {
        console.log(layers[key])
        //@ts-ignore
        geometriesBody.features.push({
            //@ts-ignore
            properties: layers[key].properties,
            //@ts-ignore
            geometry: {
                type: getPolylineType(layers[key].layerType),
                coordinates: getCoordinates(layers[key]),
            },
        });
    });
    return geometriesBody;
};