'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Plotly from 'plotly.js-dist-min';
import { DataStructure } from '@/lib/types';

interface HeatMapProps {
    data: DataStructure['detections'];
}

const HeatMap: React.FC<HeatMapProps> = ({ data }) => {
    useEffect(() => {
        // Path to locally served style JSON
        const mapStyle = `http://localhost:8080/styles/basic-preview/style.json`;

        if (!data || data.length === 0) return;

        // Initial data for the first frame
        const initialPoints = data[0].points;
        const initialData: any[] = [{
            lat: initialPoints.map(point => point.latitude),
            lon: initialPoints.map(point => point.longitude),
            z: initialPoints.map(point => point.value),
            type: 'densitymapbox',
            colorscale: 'Jet',
            hovertemplate: 'Lat: %{lat}<br>Lon: %{lon}<br>Value: %{z}<extra></extra>',
            hoverinfo: 'lat+lon+z',
        }];

        // Setup layout
        const layout: any = {
            mapbox: {
                center: { lon: 55.15, lat: 24.96 },
                zoom: 14,
                style: mapStyle,
            },
            title: 'Detection Density Heatmap',
            width: 800,
            height: 600,
            margin: { t: 30, b: 10 },
            sliders: [{
                pad: { t: 30 },
                x: 0.05,
                len: 0.95,
                currentvalue: {
                    xanchor: 'right',
                    //prefix: 'Time Window: ',
                    font: {
                        color: '#888',
                        size: 20
                    }
                },
                steps: data.map((detection, index) => ({
                    label: `${index + 1}s`,
                    method: 'animate',
                    args: [[`frame-${index}`], {
                        mode: 'immediate',
                        frame: { duration: 500, redraw: true },
                        transition: { duration: 500, easing: 'linear' }
                    }]
                })),
            }],
            updatemenus: [{
                type: 'buttons',
                showactive: false,
                x: 0.05,
                y: 0,
                xanchor: 'right',
                yanchor: 'top',
                pad: { t: 60, r: 20 },
                buttons: [{
                    label: 'Play',
                    method: 'animate',
                    args: [null, {
                        mode: 'immediate',
                        fromcurrent: true,
                        frame: { duration: 500, redraw: true },
                        transition: { duration: 500, easing: 'linear' }
                    }]
                }]
            }]
        };

        const config: any = {
            mapboxAccessToken: "your-mapbox-access-token",
        };

        // Create the plot with the initial data
        Plotly.newPlot('myDiv', initialData, layout, config).then((gd) => {
            // Add frames based on the detections data
            const frames: any[] = data.map((detection, index) => {
                const points = detection.points;
                return {
                    name: `frame-${index}`,
                    data: [{
                        lat: points.map(point => point.latitude),
                        lon: points.map(point => point.longitude),
                        z: points.map(point => point.value),
                        type: 'densitymapbox',
                        colorscale: 'Jet',
                        hovertemplate: 'Lat: %{lat}<br>Lon: %{lon}<br>Value: %{z}<extra></extra>',
                        hoverinfo: 'lat+lon+z',
                    }],
                };
            });

            Plotly.addFrames(gd, frames);
        }).catch(error => console.error("Error during Plotly.newPlot:", error));

    }, [data]);

    return (
        <div className="card p-4 mb-4 flex flex-col relative" style={{ flex: '1 1 auto', minHeight: '0' }}>
            <div id="myDiv" style={{ width: '100%', height: '620px' }}></div>
        </div>
    );
};

export default HeatMap;
