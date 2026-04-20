"use client";
import React, { useMemo } from "react";
import { LayoutDashboard, Bell, Map as MapIcon, Tag, MapPin, Plus, Settings, X } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useReminders } from "@/hooks/useReminders";

type NavItem = {
  icon: React.ReactNode;
  label: string;
  id: string;
  badge?: number;
};

const NAV_ITEMS_BASE: NavItem[] = [
  { icon: <LayoutDashboard size={18} />, label: "Dashboard", id: "dashboard" },
  { icon: <Bell size={18} />, label: "Reminders", id: "reminders" },
  { icon: <MapIcon size={18} />, label: "Map View", id: "map" },
  { icon: <Tag size={18} />, label: "Categories", id: "categories" },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen, setIsReminderModalOpen } = useAppContext();
  const { data: reminders = [] } = useReminders();

  const activeRemindersCount = useMemo(() => {
    return reminders.filter(r => !r.is_done && !r.deleted_at).length;
  }, [reminders]);

  const NAV_ITEMS = NAV_ITEMS_BASE.map(item => {
    if (item.id === "reminders") {
      return { ...item, badge: activeRemindersCount > 0 ? activeRemindersCount : undefined };
    }
    return item;
  });

  return (
    <aside className={`fixed md:static inset-y-0 left-0 w-[260px] bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col flex-shrink-0 z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(99,102,241,0.3)]">
                <MapPin size={20} className="text-white" />
              </div>
              <div>
                <span className="font-bold text-[18px] leading-tight block text-slate-900 dark:text-slate-100">GeoRemind</span>
                <span className="text-[11px] text-slate-400 font-medium tracking-wide">Location Reminders</span>
              </div>
            </div>
            <button className="md:hidden text-slate-400 hover:text-slate-600 dark:text-slate-400" onClick={() => setIsSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <button 
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl py-3 flex items-center justify-center gap-2 font-semibold text-[14px] transition-colors shadow-[0_4px_14px_-4px_rgba(99,102,241,0.5)] mb-6"
            onClick={() => {
              setIsReminderModalOpen(true);
              setIsSidebarOpen(false);
            }}
          >
            <Plus size={18} /> New Reminder
          </button>

          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 hover:dark:bg-slate-800 hover:text-slate-800 hover:dark:text-slate-200 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}>{item.icon}</span>
                    <span className="text-[14px]">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-auto p-6 space-y-2">
          <button
            onClick={() => { setActiveTab("settings"); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-start gap-3.5 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === "settings" ? "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-800"}`}
          >
            <Settings size={18} className={activeTab === "settings" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"} />
            <span className="text-[14px]">Settings</span>
          </button>
        </div>
      </aside>
  );
}

