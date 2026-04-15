"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

interface LocationMapProps {
  selectedLocation: { lat: number; lng: number } | null;
  onLocationSelect: (lat: number, lng: number) => void;
  center?: [number, number];
  zoom?: number;
}

export default function MapComponent({
  selectedLocation,
  onLocationSelect,
  center = [51.505, -0.09], // Default coords
  zoom = 13,
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
      </MapContainer>
    </div>
  );
}
