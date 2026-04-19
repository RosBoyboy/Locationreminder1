"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default Leaflet icon paths in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

const customMarkerIcon = L.divIcon({
  html: `
    <div style="position: relative; width: 32px; height: 32px;">
      <div style="width: 24px; height: 24px; border-radius: 50%; background: rgba(99,102,241,0.2); animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);"></div>
      <div style="width: 16px; height: 16px; border-radius: 50%; background: rgba(99,102,241,0.3); position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: flex; align-items: center; justify-content: center;">
        <div style="width: 8px; height: 8px; background: #4f46e5; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 2px rgba(0,0,0,0.2);"></div>
      </div>
    </div>
  `,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function MapCentrator({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
}

export default function ReadOnlyMap({
  lat,
  lng,
  radius,
}: {
  lat: number;
  lng: number;
  radius: number;
}) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      scrollWheelZoom={false}
      zoomControl={false}
      dragging={false}
      doubleClickZoom={false}
      className="w-full h-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapCentrator center={[lat, lng]} />
      <Marker position={[lat, lng]} icon={customMarkerIcon} />
      <Circle
        center={[lat, lng]}
        radius={radius}
        pathOptions={{
          color: "#6366f1",
          fillColor: "#8b5cf6",
          fillOpacity: 0.15,
          weight: 2,
          dashArray: "4",
        }}
      />
    </MapContainer>
  );
}
