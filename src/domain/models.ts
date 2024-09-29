
export interface IGeographicRegion {
    name: string;
    id: number;
    description: string;
    photo: string;
    slug: string;
    latitude: number;
    longitude: number;
    zoom: number;
    dwelling_count: number;
    population_count: number;
    parent_slug: string;
    level: number;
    children: IGeographicRegion[] | null,
    info: {
      value: string
      key: string
      title: string
    }[]
}

export interface ICategory {
    name: string;
    icon?: string;
    id: number;
}

export interface GeoJSON {
    type: string;
    properties: Record<string, any>;
    geometry: IGeometry;
}

export interface IGeometry {
    type: string;
    coordinates: number[][];
}

export interface IGeometryObject {
    geometry: GeoJSON;
    info: Record<string, any>;
    category: ICategory;
    id: number;
}

export interface IGeographicResponse {
    region: IGeographicRegion;
}

export interface IGetUpdateInfo {
    region_name: string;
    region_id: number;
    description: string;
    infos: any[];
    category_name: string;
} 