import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search } from 'lucide-react';

// Fix for default Leaflet icon paths in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
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
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

interface MapEventsProps {
  onLocationSelect: (lat: number, lng: number) => void;
  onLocationDetails?: (name: string, address: string) => void;
}

function MapEvents({ onLocationSelect, onLocationDetails }: MapEventsProps) {
  useMapEvents({
    async click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      onLocationSelect(lat, lng);

      if (onLocationDetails) {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, { headers: { "User-Agent": "LocationReminder/1.0" } }); if (!res.ok) throw new Error("Fetch failed");
          const data = await res.json();
          if (data && data.display_name) {
            const name = data.name || data.address?.city || data.address?.town || data.address?.municipality || data.address?.village || 'Custom Location';
            onLocationDetails(name, data.display_name);
          }
        } catch (err) {
          console.error('Reverse geocoding failed', err);
        }
      }
    },
  });
  return null;
}

function SearchControl({ mapCenter, setMapCenter, onLocationSelect, onLocationDetails }: { mapCenter: [number, number], setMapCenter: (v: [number, number]) => void, onLocationSelect: (lat: number, lng: number) => void, onLocationDetails?: (name: string, address: string) => void }) {
  const map = useMap();
  const [query, setQuery] = useState('');

  useEffect(() => {
    map.setView(mapCenter, map.getZoom());
  }, [mapCenter, map]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    try {
      // Append countrycodes=ph for Philippine-specific queries, helps with acronyms
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=ph&q=${encodeURIComponent(query)}`, { headers: { "User-Agent": "LocationReminder/1.0" } }); if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      if (data && data.length > 0) {
        const item = data[0];
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        setMapCenter([lat, lon]);
        map.setView([lat, lon], 14);
        onLocationSelect(lat, lon); // Automatically mark the location
        
        if (onLocationDetails) {
          const name = item.name || query;
          onLocationDetails(name, item.display_name);
        }
      }
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  return (
    <div className="absolute top-2 left-2 right-2 z-[1000]">
      <div className="relative">
        <input
          type="text"
          placeholder="Search location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch(e as any);
            }
          }}
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 rounded-xl shadow-md border-0 text-[13px] font-medium focus:ring-2 focus:ring-indigo-500/20"
        />
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}

interface MapSelectorProps {
  radius: number;
  selectedPin: { lat: number; lng: number } | null;
  onSelectPin: (lat: number, lng: number) => void;
  onLocationDetails?: (name: string, address: string) => void;
}

export default function MapSelector({ radius, selectedPin, onSelectPin, onLocationDetails }: MapSelectorProps) {
  // Default to Mindanao, Philippines
  const [mapCenter, setMapCenter] = useState<[number, number]>([8.0, 125.0]);

  return (
    <div className="h-[260px] bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden relative border-2 border-transparent focus-within:border-indigo-200 transition-colors">
      <MapContainer 
        center={mapCenter} 
        zoom={8} 
        zoomControl={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SearchControl mapCenter={mapCenter} setMapCenter={setMapCenter} onLocationSelect={onSelectPin} onLocationDetails={onLocationDetails} />
        <MapEvents onLocationSelect={onSelectPin} onLocationDetails={onLocationDetails} />

        {selectedPin && (
          <>
            <Marker position={[selectedPin.lat, selectedPin.lng]} icon={customMarkerIcon} />
            <Circle
              center={[selectedPin.lat, selectedPin.lng]}
              radius={radius}
              pathOptions={{ fillColor: '#6366f1', fillOpacity: 0.1, color: '#6366f1', weight: 1 }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
}
