// src/lib/types.ts

export interface PlotData {
  lat: number[];
  lon: number[];
  z: number[];
  type: string;
  hoverinfo: string;
  coloraxis: string;
}

export interface Layout {
  mapbox: {
    center: { lon: number; lat: number };
    style: string;
    zoom: number;
  };
  coloraxis: {
    colorscale: string;
  };
  title: {
    text: string;
  };
  width: number;
  height: number;
  margin: { t: number; b: number };
}

export interface Config {
  mapboxAccessToken: string;
}

export interface PlotDataStructure {
  heatmapData: PlotData[];
  layout: Layout;
  config: Config;
}

export interface Point {
  latitude: number;
  longitude: number;
  value: number;
}

export interface DataStructure {
  polygon: Point[];
  detections: {
    time_window_in_seconds: { start: number; end: number };
    points: Point[];
  }[];
}
