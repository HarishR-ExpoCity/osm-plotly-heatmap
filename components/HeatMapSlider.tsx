'use client';

import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import { DataStructure } from '@/lib/types';

interface HeatMapProps {
    data: DataStructure['detections'];
}

const HeatMap: React.FC<HeatMapProps> = ({ data }) => {
    const plotRef = useRef<HTMLDivElement>(null);
    const plotInstance = useRef<any>(null);
    const initialized = useRef(false);

    useEffect(() => {
        if (!plotRef.current || !data || data.length === 0) return;

        const mapStyle = `http://localhost:8080/styles/basic-preview/style.json`;

        const layout: any = {
            mapbox: {
                style: mapStyle,
                center: { lon: 55.15, lat: 24.96 },
                zoom: 14,
            },
            width: 800,
            height: 600,
            margin: { t: 30, b: 10 },
        };

        const config: any = {
            mapboxAccessToken: "your-mapbox-access-token",
        };

        const renderMap = () => {
            if (!initialized.current) {
                // Initial basemap rendering with dummy data
                Plotly.newPlot(plotRef.current!, [{
                    lat: [], // Empty data to ensure map is rendered
                    lon: [],
                    type: 'scattermapbox',
                }], layout, config)
                    .then((gd) => {
                        plotInstance.current = gd; // Store the Plotly graph object
                        initialized.current = true;
                    })
                    .catch(error => console.error("Error during initial Plotly.newPlot:", error));
            }
        };

        renderMap();

    }, [data]);

    const toggleHeatmap = () => {
        if (!plotInstance.current) return;

        const existingHeatmapIndex = plotInstance.current.data.findIndex((trace: any) => trace.type === 'densitymapbox');

        if (existingHeatmapIndex !== -1) {
            // Heatmap is already displayed, remove it
            Plotly.deleteTraces(plotInstance.current, existingHeatmapIndex).catch(error =>
                console.error("Error removing heatmap:", error)
            );
        } else {
            // Heatmap is not displayed, add it
            const initialPoints = data[0].points;
            const heatmapData: any[] = [{
                lat: initialPoints.map(point => point.latitude),
                lon: initialPoints.map(point => point.longitude),
                z: initialPoints.map(point => point.value),
                type: 'densitymapbox',
                colorscale: 'Jet',
                hovertemplate: 'Lat: %{lat}<br>Lon: %{lon}<br>Value: %{z}<extra></extra>',
                hoverinfo: 'lat+lon+z',
            }];

            Plotly.addTraces(plotInstance.current, heatmapData).catch(error =>
                console.error("Error adding heatmap:", error)
            );
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="mb-4">
                <label>
                    <input type="checkbox" onChange={toggleHeatmap} />
                    Toggle Heatmap
                </label>
            </div>
            <div className="card p-4 mb-4 flex flex-col relative" style={{ flex: '1 1 auto', minHeight: '0' }}>
                <div ref={plotRef} id="myDiv" style={{ width: '100%', height: '620px' }}></div>
            </div>
        </div>
    );
};

export default HeatMap;
