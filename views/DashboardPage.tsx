import React from 'react';
import { CheckCircle2, Clock, Zap, TrendingUp, MapPin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import LocationMap from '@/components/map/LocationMap';
import { useReminders } from '@/hooks/useReminders';
import { useCategories } from '@/hooks/useCategories';
import { authService } from '@/services/authService';
import { useAppContext } from '@/context/AppContext';

export default function DashboardPage() {
  const { data: reminders, isLoading: loadingReminders } = useReminders();
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const [userName, setUserName] = React.useState('User');
  const { setActiveTab } = useAppContext();

  React.useEffect(() => {
    authService.getCurrentUser().then(user => {
      if (user?.email) {
        setUserName(user.email.split('@')[0]);
      }
    });
  }, []);

  if (loadingReminders || loadingCategories) {
    return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-500 dark:text-indigo-400" size={32} /></div>;
  }

  const allReminders = (reminders || []).filter(r => !r.deleted_at);
  const completed = allReminders.filter(r => r.is_done || r.status === 'Done').length;
  const pending = allReminders.filter(r => !r.is_done && r.status === 'Pending').length;
  const active = allReminders.filter(r => !r.is_done && r.status === 'Active').length;
  const total = allReminders.length;

  const allCategories = categories || [];

  const mapMarkers = allReminders
    .filter((r) => !r.is_done && r.location?.lat && r.location?.lng)
    .map((r) => ({
      lat: r.location!.lat,
      lng: r.location!.lng,
      title: r.title,
      id: r.id,
      color: '#6366f1',
      bgColor: '#e0e7ff',
      radius: r.location!.radius,
    }));
  const mapCenter: [number, number] = mapMarkers.length > 0 
    ? [mapMarkers[0].lat, mapMarkers[0].lng] 
    : [12.8797, 121.7740];
  const mapZoom = mapMarkers.length > 0 ? 12 : 5;

  return (
    <div className="max-w-[1300px] mx-auto w-full space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-2">
            Good morning, {userName.charAt(0).toUpperCase() + userName.slice(1)}! <span className="transform origin-bottom-right hover:rotate-12 transition-transform duration-300">👋</span>
          </h1>
          <p className="text-[15px] text-slate-500 dark:text-slate-400 mt-1 font-medium">You have {pending + active} pending reminders today</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { icon: <CheckCircle2 size={24} className="text-emerald-500" />, count: completed, label: "Completed", color: "border-emerald-100 bg-white dark:bg-slate-900" },
          { icon: <Clock size={24} className="text-amber-500" />, count: pending, label: "Pending", color: "border-amber-100 bg-white dark:bg-slate-900" },
          { icon: <Zap size={24} className="text-indigo-500 dark:text-indigo-400" />, count: active, label: "Active", color: "border-indigo-100 bg-white dark:bg-slate-900" },
          { icon: <TrendingUp size={24} className="text-slate-500 dark:text-slate-400" />, count: total, label: "Total", color: "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" },
        ].map((stat, i) => (
          <div key={i} className={"flex flex-col p-6 rounded-2xl border  shadow-sm transition-transform hover:-translate-y-1 duration-300 relative overflow-hidden"}>
            <div className={"w-12 h-12 rounded-[14px] flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 mb-5"}>
              {stat.icon}
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 leading-none">{stat.count}</h3>
              <p className="text-[14px] text-slate-500 dark:text-slate-400 font-medium mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-start">
        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4 h-8 px-1">
              <h2 className="text-[18px] font-bold text-slate-800 dark:text-slate-200">Today&apos;s Reminders</h2>
              <button onClick={() => setActiveTab('reminders')} className="text-[14px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline decoration-indigo-200 underline-offset-4">View all</button>
            </div>
            <div className="space-y-4">
              {allReminders.slice(0, 3).map((r, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 flex items-start justify-between shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group">
                  <div className="space-y-1">
                    <h3 className="font-bold text-[16px] text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:text-indigo-400 transition-colors">{r.title}</h3>
                    <p className="text-[13px] text-slate-400 font-medium whitespace-pre-wrap">{r.description || "No description"}</p>
                    <div className="flex items-center gap-3 text-[12px] font-semibold mt-4">
                      <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <MapPin size={13} className="text-indigo-400" />
                        {r.location?.name || "No location"}
                      </span>
                      {r.category_id && (() => {
                        const cat = allCategories.find(c => c.id === r.category_id);
                        return cat ? (
                          <span className={"px-2.5 py-0.5 rounded-full text-indigo-600 dark:text-indigo-400 bg-indigo-500/20"}>
                            {cat.name}
                          </span>
                        ) : null;
                      })()}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    r.is_done ? "bg-emerald-100 text-emerald-700" :
                    r.status === 'Active' ? "bg-indigo-100 text-indigo-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {r.is_done ? "DONE" : r.status.toUpperCase()}
                  </div>
                </div>
              ))}
              {allReminders.length === 0 && (
                <div className="py-8 text-center text-slate-500 dark:text-slate-400 italic text-sm">No reminders yet.</div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-10">
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-200">Live Map</h2>
              <button onClick={() => setActiveTab('map')} className="text-[14px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline decoration-indigo-200 underline-offset-4">Full view</button>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 h-[280px] relative">
                <LocationMap 
                  selectedLocation={null} 
                  onLocationSelect={() => {}} 
                  markers={mapMarkers}
                  center={mapCenter}
                  zoom={mapZoom}
                />
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4 h-8 px-1">
              <h2 className="text-[18px] font-bold text-slate-800 dark:text-slate-200">By Category</h2>
            </div>
            <div className="bg-white dark:bg-slate-900 border rounded-2xl border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
              {allCategories.length === 0 ? (
                <div className="text-sm italic text-slate-500 dark:text-slate-400">No categories found.</div>
              ) : (
                allCategories.map((c, i) => {
                  const catReminders = allReminders.filter(r => r.category_id === c.id);
                  const progress = allReminders.length === 0 ? 0 : Math.round((catReminders.length / allReminders.length) * 100);
                  
                  return (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[13px] font-bold text-slate-700 dark:text-slate-300">
                        <span>{c.name}</span>
                        <span className="text-slate-400">{progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={"h-full rounded-full bg-indigo-500 hover:bg-indigo-600 text-white"} style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

