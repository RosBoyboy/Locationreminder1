import React, { useState } from 'react';
import { Plus, MapPin, Search } from 'lucide-react';
import LocationMap from '@/components/map/LocationMap';
import { useReminders } from '@/hooks/useReminders';
import CreateReminderModal from '@/components/reminders/CreateReminderModal';
import { Reminder } from '@/types/models';
import { useAppContext } from '@/context/AppContext';
import Breadcrumbs from '@/components/Breadcrumbs';

const colorToHex: Record<string, { color: string, bg: string }> = {
  indigo: { color: "#6366f1", bg: "#e0e7ff" },
  emerald: { color: "#10b981", bg: "#d1fae5" },
  rose: { color: "#f43f5e", bg: "#ffe4e6" },
  amber: { color: "#f59e0b", bg: "#fef3c7" },
  blue: { color: "#3b82f6", bg: "#dbeafe" },
  purple: { color: "#8b5cf6", bg: "#f3e8ff" },
  sky: { color: "#0ea5e9", bg: "#e0f2fe" }
};

export default function MapPage() {
  const { data: reminders } = useReminders();
  const { mapCenterFocus, setMapCenterFocus } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [center, setCenter] = useState<[number, number]>([8.0, 125.0]); // Mindanao default

  const mapReminders = reminders?.filter(r => r.location && r.location.lat && r.location.lng && !r.deleted_at) || [];

  // Automatically center on the newest added location when data loads
  React.useEffect(() => {
    if (mapCenterFocus) {
      setCenter(mapCenterFocus);
      setMapCenterFocus(null); // Reset after focusing
    } else if (mapReminders.length > 0 && !mapCenterFocus) {
      // Assuming the most recent reminder is first in the array
      setCenter([mapReminders[0].location!.lat, mapReminders[0].location!.lng]);
    }
  }, [reminders, mapCenterFocus, setMapCenterFocus]);

  const markers = mapReminders.map(r => {
    const theme = colorToHex[r.category?.color || 'indigo'] || colorToHex.indigo;
    return {
      id: r.id,
      lat: r.location!.lat,
      lng: r.location!.lng,
      color: theme.color,
      bgColor: theme.bg,
      radius: r.location!.radius || 100
    };
  });

    return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] relative w-full">  
      <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10 flex-shrink-0">
        <div>
          <Breadcrumbs />
          <h1 className="text-[28px] font-bold text-slate-800 dark:text-slate-200 tracking-tight mt-1">Map View</h1>
          <p className="text-[14px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{mapReminders.length} active location triggers</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-4 py-2 flex items-center gap-2 font-semibold shadow-sm transition-transform hover:-translate-y-0.5"
        >
          <Plus size={20} />
          <span>New Reminder</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        <div className="h-[40vh] md:h-full md:flex-1 relative z-0 shrink-0">
           <LocationMap center={center} zoom={13} markers={markers} selectedLocation={null} onLocationSelect={() => {}} />
        </div>

        <div className="w-full md:w-[360px] bg-white dark:bg-slate-900 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 flex flex-col flex-shrink-0 z-10 shadow-[-4px_0_24px_-12px_rgba(0,0,0,0.03)] flex-1 md:h-full overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-[15px] font-bold text-slate-800 dark:text-slate-200">Active Pins</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {mapReminders.length === 0 && (
               <div className="text-center py-10 text-slate-400 font-medium text-[13px]">
                  No active locations found.
               </div>
            )}
            {mapReminders.map((pin) => {
              const theme = colorToHex[pin.category?.color || 'indigo'] || colorToHex.indigo;
              return (
              <div 
                key={pin.id} 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group"
                onClick={() => setCenter([pin.location!.lat, pin.location!.lng])}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-[14px] text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:text-indigo-400 transition-colors break-all">
                    {pin.title}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${pin.is_done ? 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400' : 'bg-blue-50 text-blue-600'}`}>
                    {pin.is_done ? 'Done' : 'Active'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 dark:text-slate-400 mb-3">
                   <div style={{ color: theme.color }}><MapPin size={12} strokeWidth={2.5} /></div>
                   <span>{pin.location?.name || 'Custom Location'}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                   <div className="px-2 py-1 rounded-md text-[11px] font-bold" style={{ backgroundColor: theme.bg, color: theme.color }}>
                      {pin.category?.name || 'Uncategorized'}
                   </div>
                   <div className="text-[11px] font-medium text-slate-400">
                     {pin.location?.radius || 100}m radius
                   </div>
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>
      <CreateReminderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

