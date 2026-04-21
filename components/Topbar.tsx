"use client";
import React, { useState, useEffect } from "react";
import { Search, Wifi, Bell, ChevronDown, Settings, LogOut, Menu, X, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { useReminders } from "@/hooks/useReminders";
import { useQueryClient } from "@tanstack/react-query";
import { Reminder } from "@/types/models";

export default function Topbar({ activeAlarms, dismissAlarm }: { activeAlarms: Reminder[]; dismissAlarm: (id: string) => void; }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setActiveTab, setIsSidebarOpen, setExpandedAlarmId, setMapCenterFocus } = useAppContext();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);    
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);        
  const [user, setUser] = useState<User | null>(null);
  const { data: allReminders } = useReminders();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchResults = (searchQuery.trim() && allReminders) ? allReminders.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.location?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.location?.address?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5) : [];
  useEffect(() => {
    authService.getCurrentUser().then(setUser).catch(err => console.error("Failed to load user", err));
  }, []);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      queryClient.clear();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="h-[76px] bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-[50] sticky top-0">
      <div className="flex items-center w-full max-w-[400px] gap-3">
        <button 
          className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-800"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={20} />
        </button>
        <div 
          className="relative w-full"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setTimeout(() => setIsSearchFocused(false), 200);
            }
          }}
        >
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search reminders, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-[12px] pl-11 pr-4 py-2.5 text-[14px] text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-200 focus:bg-white dark:bg-slate-900 transition-all shadow-sm"
          />
          {isSearchFocused && searchQuery.trim() !== "" && (
            <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden z-[100] max-h-[360px] flex flex-col items-stretch">
              {searchResults.length > 0 ? (
                <div className="flex flex-col w-full overflow-y-auto">
                  <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Reminders
                  </div>
                  {searchResults.map(r => (
                    <div
                      key={r.id}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center px-4 py-3 hover:bg-indigo-500/20 text-left transition-colors border-b border-slate-50 last:border-0 group cursor-pointer"
                      onClick={() => {
                        setExpandedAlarmId(r.id);
                        setIsSearchFocused(false);
                        setSearchQuery("");
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-center shrink-0 hidden sm:flex">
                        {r.location ? <MapPin size={14} /> : <Bell size={14} />}
                      </div>
                      <div className="flex-1 min-w-0 sm:ml-3 flex flex-col justify-center">
                        <p className="text-[14px] font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {r.title}
                        </p>
                        {r.location?.name && (
                          <div 
                            className="text-[12px] font-medium text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5 mt-0.5 hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors inline-block max-w-fit"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTab('map');
                              if (r.location?.lat && r.location?.lng) {
                                setMapCenterFocus([r.location.lat, r.location.lng]);
                              }
                              setIsSearchFocused(false);
                              setSearchQuery("");
                            }}
                          >
                            <MapPin size={12} className="text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" /> 
                            <span>{r.location.name} <span className="text-slate-400 opacity-60 text-[10px] ml-1">(Click to map)</span></span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center flex flex-col items-center justify-center gap-2">
                  <Search size={24} className="text-slate-300" />
                  <p className="text-slate-500 dark:text-slate-400 text-[13px] font-medium">No matches found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-5">
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[12px] font-semibold rounded-full border border-emerald-100/50">
          <Wifi size={14} /> Online
        </div>
        
        <div className="relative">
          <button 
            className="text-slate-400 hover:text-slate-600 dark:text-slate-400 transition-colors mx-2 p-2 rounded-full hover:bg-slate-50 dark:bg-slate-800 relative"
            onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
          >
            <Bell size={20} />
            {activeAlarms.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            )}
          </button>
          
          {/* Notification Dropdown */}
          <AnimatePresence>
            {isNotifDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-12 right-0 w-[320px] bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 dark:border-slate-800 overflow-hidden z-50 origin-top-right cursor-default flex flex-col max-h-[400px]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between sticky top-0 z-10 shrink-0">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Active Notifications</h3>
                  {activeAlarms.length > 0 && (
                    <span className="bg-rose-100 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded-full">{activeAlarms.length}</span>
                  )}
                </div>

                <div className="overflow-y-auto flex-1 p-2">
                  {activeAlarms.length === 0 ? (
                    <div className="p-6 text-center flex flex-col items-center gap-2">
                      <Bell size={24} className="text-slate-200" />
                      <p className="text-sm font-medium text-slate-400">All caught up!</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {activeAlarms.map((alarm) => {
                        const loc = Array.isArray(alarm.location) ? alarm.location[0] : alarm.location;
                        return (
                          <div 
                            key={alarm.id} 
                            onClick={() => {
                              setExpandedAlarmId(alarm.id);
                              setIsNotifDropdownOpen(false);
                            }}
                            className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-100 dark:border-slate-800 group relative cursor-pointer"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                dismissAlarm(alarm.id);
                              }}
                              className="absolute top-3 right-3 text-slate-300 hover:text-slate-600 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                                <MapPin size={14} />
                              </div>
                              <div className="pr-4">
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{alarm.title}</h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 line-clamp-1">
                                  {loc?.name || "Local Trigger"}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-8 w-[1px] bg-slate-200"></div>

        <div className="flex items-center gap-3 cursor-pointer group pl-2 relative" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}>
            <div className="w-9 h-9 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold flex items-center justify-center text-[13px] shadow-sm">
            {user?.user_metadata?.full_name?.substring(0, 2)?.toUpperCase() || user?.email?.substring(0, 2)?.toUpperCase() || 'U'}
            </div>
            <div className="hidden md:flex flex-col">
            <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{user?.user_metadata?.full_name || 'User'}</span>
            <span className="text-[11px] text-slate-400 font-medium">{user?.email || ''}</span>
            </div>
            <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 dark:text-slate-400 ml-1" />

            <AnimatePresence>
            {isProfileDropdownOpen && (
                <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-12 right-0 w-[240px] bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 dark:border-slate-800 overflow-hidden z-50 origin-top-right cursor-default"
                onClick={(e) => e.stopPropagation()}
                >
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <p className="font-bold text-[14px] text-slate-900 dark:text-slate-100 leading-none mb-1">{user?.user_metadata?.full_name || 'User'}</p>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">{user?.email || ''}</p>
                </div>
                <div className="p-2 flex flex-col gap-1">
                    <button 
                    onClick={() => { setActiveTab("settings"); setIsProfileDropdownOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:bg-slate-800 text-[13px] font-semibold text-slate-700 dark:text-slate-300 transition-colors group/btn"
                    >
                    <Settings size={16} className="text-slate-400 group-hover/btn:text-slate-700 dark:text-slate-300" />
                    Settings
                    </button>
                    <button 
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50 text-[13px] font-semibold text-rose-600 transition-colors"
                    >
                    <LogOut size={16} />
                    Sign Out
                    </button>
                </div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
      </div>
    </header>
  );
}


