'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Point } from '@/lib/types';
import { Data, Layout, Config } from 'plotly.js'; // Import types from Plotly.js

interface HeatMapProps {
  data: Point[];
}

const Plot = dynamic(() => import('react-plotly.js'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full">
      {/* Loading UI */}
    </div>
  ),
});

interface PlotDataStructure {
  heatmapData: Data[];
  layout: Partial<Layout>;
  config: Partial<Config>;
}

const HeatMap: React.FC<HeatMapProps> = ({ data }) => {
  const [plotData, setPlotData] = useState<PlotDataStructure | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mapStyle = `http://localhost:8080/styles/basic-preview/512/{z}/{x}/{y}.png`;

    const latitudes = data.map(point => point.latitude);
    const longitudes = data.map(point => point.longitude);
    const values = data.map(point => point.value);

    // Define the heatmap data
    const heatmapData: Data[] = [{
      lat: latitudes,
      lon: longitudes,
      z: values,
      type: "densitymapbox",
      hoverinfo: 'skip',
      colorscale: "Jet",
    }];

    const layout: Partial<Layout> = {
      mapbox: {
        center: { lon: 55.15, lat: 24.96 },
        style: `http://localhost:8080/styles/basic-preview/style.json`,
        zoom: 13,
      },
      title: {
        text: "Detection Density Heatmap",
      },
      width: 800,
      height: 600,
      margin: { t: 30, b: 0 },
    };

    const config: Partial<Config> = {
      mapboxAccessToken: "your-mapbox-access-token",
    };

    setPlotData({ heatmapData, layout, config });
    setIsLoading(false);
  }, [data]);

  return (
    <div className="card p-4 mb-4 flex flex-col relative" style={{ flex: '1 1 auto', minHeight: '0' }}>
      {isLoading ? (
        <div className="flex items-center justify-center h-full w-full">
          {/* Loading UI */}
        </div>
      ) : (
        plotData && (
          <Plot
            data={plotData.heatmapData}
            layout={plotData.layout}
            config={plotData.config}
            style={{ width: '100%', height: '620px' }}
          />
        )
      )}
    </div>
  );
};

export default HeatMap;
