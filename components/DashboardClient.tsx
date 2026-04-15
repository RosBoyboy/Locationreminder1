"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReminderForm } from "@/components/reminders/ReminderForm";
import LocationMap from "@/components/map/LocationMap";
import { ReminderList } from "@/components/reminders/ReminderList";
import { useGeofencing } from "@/hooks/useGeofencing";
import { 
  MapPin, Bell, Map as MapIcon, Tag, LogOut, Settings, 
  Menu, X, Plus, Activity, Search
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

const NAV_ITEMS = [
  { icon: <Activity size={18} />, label: "Dashboard", id: "dashboard", active: true },
  { icon: <Bell size={18} />, label: "Reminders", id: "reminders", active: false },
  { icon: <MapIcon size={18} />, label: "Map View", id: "map", active: false },
  { icon: <Tag size={18} />, label: "Categories", id: "categories", active: false },
];

export default function DashboardClient() {
  const router = useRouter();
  const supabase = createClient();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const { currentPosition, activeReminders } = useGeofencing();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-slate-50/50 overflow-hidden font-sans">
      {/* ── SIDEBAR (Desktop) ── */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-100 flex-col flex-shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
              <MapPin size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 text-[18px]">GeoRemind</span>
          </div>

          <div className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600 font-medium"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  <span className={isActive ? "text-indigo-600" : "text-slate-400"}>
                    {item.icon}
                  </span>
                  <span className="text-[14px]">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-auto p-6 space-y-2 border-t border-slate-50/50 bg-slate-50/30">
          <button className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-white transition-colors">
            <Settings size={18} className="text-slate-400" />
            <span className="text-[14px] font-medium">Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut size={18} className="opacity-80" />
            <span className="text-[14px] font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col min-w-0 relative h-screen">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 z-20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <MapPin size={14} className="text-white" />
            </div>
            <span className="font-bold text-slate-800">GeoRemind</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-[65px] left-0 right-0 bg-white border-b border-slate-100 shadow-xl z-30 p-4 md:hidden"
            >
              <div className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                      activeTab === item.id ? "bg-indigo-50 text-indigo-600" : "text-slate-600"
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
                <div className="h-px bg-slate-100 my-2" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 font-medium"
                >
                  <LogOut size={18} />
                  Log out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Header / Status */}
        <div className="px-6 py-6 border-b border-slate-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Overview</h1>
            <p className="text-[14px] text-slate-500 mt-1">Manage your places and triggers.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {currentPosition ? (
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100/50 shadow-sm text-xs font-semibold">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                </span>
                Tracking Active
                <span className="opacity-60 font-normal hidden sm:inline ml-1 px-1 border-l border-emerald-200">
                  {currentPosition.coords.latitude.toFixed(3)}, {currentPosition.coords.longitude.toFixed(3)}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-slate-100 text-slate-500 text-xs font-medium border border-slate-200/50">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-400/50"></span>
                Locating...
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Main Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 lg:pb-6 relative h-full">
          <div className="grid lg:grid-cols-[1fr_380px] gap-6 h-full min-h-[700px] max-w-7xl mx-auto w-full">
            
            {/* Map Column */}
            <div className="flex flex-col rounded-2xl bg-white border border-slate-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] overflow-hidden h-[400px] lg:h-auto relative">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                <h2 className="font-semibold text-slate-800 text-[15px] flex items-center gap-2">
                  <MapIcon size={16} className="text-indigo-500" />
                  Interactive Map
                </h2>
                {selectedLocation && (
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="text-xs font-medium text-rose-500 hover:text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <X size={14} /> Clear Pin
                  </button>
                )}
              </div>
              <div className="flex-1 relative bg-slate-50">
                <LocationMap
                  selectedLocation={selectedLocation}
                  onLocationSelect={(lat, lng) => setSelectedLocation({ lat, lng })}
                />
              </div>
            </div>

            {/* Form / List Column */}
            <div className="flex flex-col h-full rounded-2xl bg-white border border-slate-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] overflow-hidden">
              <AnimatePresence mode="wait">
                {selectedLocation ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full flex flex-col"
                  >
                    <ScrollArea className="h-full">
                      <div className="p-4">
                        <ReminderForm
                          selectedLocation={selectedLocation}
                          onClearLocation={() => setSelectedLocation(null)}
                        />
                      </div>
                    </ScrollArea>
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full flex flex-col bg-slate-50/30"
                  >
                    <div className="p-5 pb-3 border-b border-slate-100 bg-white sticky top-0 z-10 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-slate-800 text-[15px] flex items-center gap-2">
                          <Bell size={16} className="text-amber-500" />
                          My Reminders
                        </h2>
                        <span className="text-[11px] font-medium px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md">Live</span>
                      </div>
                      
                      {/* Search mock */}
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Search triggers..." 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                    
                    <ScrollArea className="flex-1 p-4 pb-20 lg:pb-4">
                      <ReminderList />
                    </ScrollArea>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}