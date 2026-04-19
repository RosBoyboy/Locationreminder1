"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, Circle, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import React, { useEffect } from "react";

const customIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = customIcon;

interface MapEventsProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

const LocationPicker = ({ onLocationSelect }: MapEventsProps) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export interface LocationMapProps {
  selectedLocation: { lat: number; lng: number } | null;
  onLocationSelect: (lat: number, lng: number) => void;
  center?: [number, number];
  zoom?: number;
  markers?: { id: string; lat: number; lng: number; color: string; bgColor: string; radius?: number }[];
}

function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center[0], center[1], zoom, map]); // Stable center reference
  return null;
}

export default function MapComponent({
  selectedLocation,
  onLocationSelect,
  center = [51.505, -0.09], // Default coords
  zoom = 13,
  markers = [],
}: LocationMapProps) {
  return (
    <div className="absolute inset-0">
      <style>{`
        /* Minimal custom map styling to match the brand */
        .leaflet-container { background: #f8fafc; z-index: 10; font-family: inherit; }
        .leaflet-popup-content-wrapper { border-radius: 12px; box-shadow: 0 4px 20px -4px rgba(0,0,0,0.1); padding: 4px; }
        .leaflet-popup-content { margin: 8px 12px; font-size: 13px; font-weight: 500; color: #1e293b; }
      `}</style>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapUpdater center={center} zoom={zoom} />
        <LocationPicker onLocationSelect={onLocationSelect} />
        {selectedLocation && (
          <>
            <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
              <Popup>Selected Trigger Area</Popup>
            </Marker>
            <Circle 
              center={[selectedLocation.lat, selectedLocation.lng]} 
              radius={100}
              pathOptions={{ 
                color: "#6366f1", 
                fillColor: "#8b5cf6", 
                fillOpacity: 0.15,
                weight: 2,
                dashArray: "4" 
              }} 
            />
          </>
        )}
        
        {markers.map((m) => {
          const divIcon = L.divIcon({
            className: "custom-marker-icon",
            html: `<div style="background-color: ${m.bgColor}; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 2px solid white; position: relative;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${m.color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg><div style="position: absolute; bottom: -6px; width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid ${m.bgColor};"></div></div>`,
            iconSize: [34, 40],
            iconAnchor: [17, 40],
          });

          return (
            <React.Fragment key={m.id}>
              <Marker position={[m.lat, m.lng]} icon={divIcon} />
              <Circle
                center={[m.lat, m.lng]}
                radius={m.radius || 200}
                pathOptions={{
                  color: m.color,
                  fillColor: m.bgColor,
                  fillOpacity: 0.15,
                  weight: 1,
                  dashArray: "4"
                }}
              />
            </React.Fragment>
          );
        })}
      </MapContainer>

    </div>

  );

}



