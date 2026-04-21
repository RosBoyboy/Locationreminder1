import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellRing, Check, Clock, MapPin, X, Navigation, Calendar, ChevronRight } from 'lucide-react';
import { Reminder } from '@/types/models';
import { useUpdateReminder, useReminders } from '@/hooks/useReminders';
import { useAppContext } from '@/context/AppContext';
import LocationMap from '@/components/map/LocationMap';
import dynamic from 'next/dynamic';

const ReadOnlyMap = dynamic(() => import('@/components/reminders/ReadOnlyMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full text-slate-400 text-sm font-medium flex items-center justify-center gap-2">
      <MapPin size={16} className="animate-bounce" /> Loading Map...
    </div>
  )
});

const categoryColors: Record<string, { bg: string, bgSoft: string, text: string, textDark: string, border: string }> = {
    indigo: { bg: 'bg-indigo-500', bgSoft: 'bg-indigo-50', text: 'text-indigo-500 dark:text-indigo-400', textDark: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500' },
  emerald: { bg: 'bg-emerald-500', bgSoft: 'bg-emerald-50', text: 'text-emerald-500', textDark: 'text-emerald-600', border: 'border-emerald-500' },
  rose: { bg: 'bg-rose-500', bgSoft: 'bg-rose-50', text: 'text-rose-500', textDark: 'text-rose-600', border: 'border-rose-500' },
  amber: { bg: 'bg-amber-500', bgSoft: 'bg-amber-50', text: 'text-amber-500', textDark: 'text-amber-600', border: 'border-amber-500' },
  blue: { bg: 'bg-blue-500', bgSoft: 'bg-blue-50', text: 'text-blue-500', textDark: 'text-blue-600', border: 'border-blue-500' },
  purple: { bg: 'bg-purple-500', bgSoft: 'bg-purple-50', text: 'text-purple-500', textDark: 'text-purple-600', border: 'border-purple-500' },
  sky: { bg: 'bg-sky-500', bgSoft: 'bg-sky-50', text: 'text-sky-500', textDark: 'text-sky-600', border: 'border-sky-500' },
};

export default function ActiveReminderModal({ activeAlarms, snoozeAlarm, dismissAlarm }: { activeAlarms: Reminder[]; snoozeAlarm: (reminderId: string, minutes?: number) => void; dismissAlarm: (reminderId: string) => void; }) {
  const { expandedAlarmId, setExpandedAlarmId } = useAppContext();
  const { mutate: updateReminder } = useUpdateReminder();
  const { data: allReminders = [] } = useReminders();

  React.useEffect(() => {
    if (activeAlarms.length > 0) {
      if (expandedAlarmId === null && activeAlarms.length === 1) {
        // First alarm triggered
      }
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc.frequency.setValueAtTime(0, audioCtx.currentTime + 0.1);
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.2);
        osc.frequency.setValueAtTime(0, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 0.4); osc.onended = () => { osc.disconnect(); gain.disconnect(); audioCtx.close(); };
      } catch (e) {
        console.error("Audio fail", e);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAlarms.length]);

  const handleMarkAsDone = (alarm: Reminder) => {
    updateReminder({ id: alarm.id, payload: { is_done: true, status: 'Done' }});
    dismissAlarm(alarm.id);
    if (expandedAlarmId === alarm.id) setExpandedAlarmId(null);
  };

  const handleSnooze = (alarm: Reminder, minutes: number) => {
    snoozeAlarm(alarm.id, minutes);
    if (expandedAlarmId === alarm.id) setExpandedAlarmId(null);
  };
  
  const handleDismiss = (alarm: Reminder) => {
    dismissAlarm(alarm.id);
    if (expandedAlarmId === alarm.id) setExpandedAlarmId(null);
  };

  // Ensure we can expand the alarm even if it was dismissed from a different useGeofencing hook instance
  const expandedAlarm = allReminders.find((a: Reminder) => a.id === expandedAlarmId);

  const suggestedIdeas = React.useMemo(() => {
    if (!expandedAlarm || !expandedAlarm.category?.name) return [];

    const cat = expandedAlarm.category.name.toLowerCase();

    // AI-like automated suggestions based on category
    if (cat.includes('grocer') || cat.includes('shop') || cat.includes('store') || cat.includes('buy')) {
      return [
        { id: '1', title: 'Pick up fresh produce', loc: 'Nearby Supermarket' },
        { id: '2', title: 'Check for household supplies', loc: 'Department Store' },
        { id: '3', title: 'Grab some snacks', loc: 'Convenience Store' }
      ];
    } else if (cat.includes('work') || cat.includes('office') || cat.includes('job')) {
      return [
        { id: '1', title: 'Respond to urgent emails', loc: 'Workspace' },
        { id: '2', title: 'Prepare for the next meeting', loc: 'Conference Room' },
        { id: '3', title: 'Sync up with a colleague', loc: 'Break Room' }
      ];
    } else if (cat.includes('health') || cat.includes('gym') || cat.includes('fitness')) {
      return [
        { id: '1', title: 'Stretch for 5 minutes', loc: 'Rest Area' },
        { id: '2', title: 'Drink a bottle of water', loc: 'Nearby Cafe' },
        { id: '3', title: 'Buy some protein snacks', loc: 'Health Store' }
      ];
    } else if (cat.includes('school') || cat.includes('study') || cat.includes('class')) {
      return [
        { id: '1', title: 'Review study notes', loc: 'Library' },
        { id: '2', title: 'Check assignment deadlines', loc: 'Study Hall' },
        { id: '3', title: 'Grab a quick textbook', loc: 'Bookstore' }
      ];
    } else {
      // Generic "Personal" or fallback suggestions
      return [
        { id: '1', title: 'Grab a quick coffee', loc: 'Nearby Cafe' },
        { id: '2', title: 'Take a short walk', loc: 'Nearby Park' },
        { id: '3', title: 'Run a quick errand', loc: 'Town Center' }
      ];
    }
  }, [expandedAlarm]);

  return (
    <>
      {/* Toast Notifications */}
      <div className="fixed bottom-8 right-8 z-[9990] flex flex-col gap-4 max-w-[340px] w-full pointer-events-none">
        <AnimatePresence>
          {activeAlarms.filter(a => a.id !== expandedAlarmId).map((alarm) => {
            const colorName = alarm.category?.color || 'indigo';
            const colors = categoryColors[colorName] || categoryColors.indigo;

            return (
              <motion.div
                key={alarm.id}
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.9, height: 0, marginTop: 0 }}
                className={`bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden pointer-events-auto shrink-0 flex flex-col relative border-t-4 ${colors.border}`}
              >
                <div className="p-4">
                  {(() => {
                    const loc = Array.isArray(alarm.location) ? alarm.location[0] : alarm.location;
                    return (
                      <>
                        <div className="flex items-start gap-4">
                          {/* Icon Box */}
                          <div className={`w-12 h-12 shrink-0 rounded-2xl ${colors.bgSoft} flex items-center justify-center -mt-0.5`}>
                            <MapPin size={22} className={colors.text} />
                          </div>
                          
                          {/* Text Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-1.5 mb-1 pt-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${colors.bg} opacity-80`} />
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.text}`}>Location Triggered</span>
                              </div>
                              <button onClick={() => handleDismiss(alarm)} className="text-slate-300 hover:text-slate-500 dark:text-slate-400 transition-colors p-1 -mt-1 -mr-1 shrink-0">
                                <X size={16} />
                              </button>
                            </div>
                            
                            <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1 mb-1 pr-4">{alarm.title}</h3>
                            
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <MapPin size={12} className="text-rose-400 shrink-0" />
                              <span className="text-xs font-medium line-clamp-1">{loc?.name || "Local Trigger"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Buttons */}
                        <button 
                          onClick={() => setExpandedAlarmId(alarm.id)}
                          className={`mt-4 w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold ${colors.bgSoft} ${colors.textDark} hover:opacity-80 transition-opacity`}
                        >
                          <span>View full reminder details</span>
                          <ChevronRight size={14} />
                        </button>

                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => handleMarkAsDone(alarm)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                          >
                            <Check size={14} />
                            <span>Done</span>
                          </button>
                          <button
                            onClick={() => handleSnooze(alarm, 10)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800 transition-colors"
                          >
                            <Clock size={14} />
                            <span>Snooze</span>
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Expanded Detail Modal */}
      <AnimatePresence>
        {expandedAlarm && (() => {
          const colorName = expandedAlarm.category?.color || 'indigo';
          const colors = categoryColors[colorName] || categoryColors.indigo;
          const currentDate = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
          const currentTime = new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

          return (
            <motion.div
              key="full-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm shadow-2xl"
              onClick={() => setExpandedAlarmId(null)}
            >
              <div className="flex flex-col md:flex-row gap-6 items-start w-full max-w-5xl justify-center pointer-events-none">
                {/* Main Modal */}
                <motion.div
                  initial={{ scale: 0.95, y: 15, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.95, y: 15, opacity: 0 }}
                  className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] pointer-events-auto shrink-0"
                  onClick={e => e.stopPropagation()}
                >
                  {/* Header */}
                <div className={`${colors.bg} p-6 sm:p-8 flex flex-col relative shrink-0 transition-colors duration-300`}>
                  <button onClick={() => setExpandedAlarmId(null)} className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                        <div className={`bg-white dark:bg-slate-900/20 p-2 rounded-xl backdrop-blur-sm relative z-10 w-12 h-12 flex items-center justify-center ${colors.text}`}>
                        <BellRing size={24} />
                      </div>
                      <div className="absolute top-0 -right-1 z-20 w-3.5 h-3.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-white dark:bg-slate-900 opacity-50 animate-ping" />
                        <span className="relative inline-flex rounded-full h-full w-full bg-white dark:bg-slate-900" />
                      </div>
                    </div>
                    <div>
                      <p className="text-white/80 font-bold text-xs uppercase tracking-wider mb-0.5">Location Triggered</p>
                      <h2 className="text-white text-sm font-semibold">You've arrived at the zone!</h2>
                    </div>
                  </div>

                  <h1 className="text-white text-3xl font-black tracking-tight leading-tight break-words drop-shadow-sm">{expandedAlarm.title}</h1>
                  
                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    {expandedAlarm.category?.name && (
                      <span className="px-3 py-1.5 bg-black/15 backdrop-blur-md rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1.5">
                        <span className="opacity-80">📁</span> {expandedAlarm.category.name}
                      </span>
                    )}
                    <span className="px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-full text-xs font-bold shadow-sm">
                      Active
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 bg-slate-50 dark:bg-slate-800/50">
                  {(() => {
                    const loc = Array.isArray(expandedAlarm.location) ? expandedAlarm.location[0] : expandedAlarm.location;
                    return (
                      <>
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm col-span-2">
                          <div className="flex items-center gap-2 text-slate-400 mb-2">
                            <Clock size={14} />
                            <span className="text-xs font-bold uppercase tracking-wider">Description</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                            {expandedAlarm.description || <span className="italic text-slate-400">No additional notes provided.</span>}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 shrink-0">
                          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <MapPin size={13} />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Location</span>
                            </div>
                            <span className="text-slate-800 dark:text-slate-200 font-bold text-sm truncate">{loc?.name || "Local Trigger"}</span>
                          </div>
                          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Navigation size={13} />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Radius</span>
                            </div>
                            <span className="text-slate-800 dark:text-slate-200 font-bold text-sm truncate">{loc?.radius || 100}m geofence</span>
                          </div>
                          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Calendar size={13} />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Date</span>
                            </div>
                            <span className="text-slate-800 dark:text-slate-200 font-bold text-sm truncate">Today, {currentDate}</span>
                          </div>
                          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Clock size={13} className="text-slate-400" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Time</span>
                            </div>
                            <span className="text-slate-800 dark:text-slate-200 font-bold text-sm truncate">{currentTime}</span>
                          </div>
                        </div>

                        {/* Geofence Map Context */}
                        <div className="flex flex-col gap-2 shrink-0">
                          <div className="flex items-center gap-2 text-slate-400 px-1">
                            <MapPin size={14} />
                            <span className="text-xs font-bold uppercase tracking-wider">Geofence Map</span>
                          </div>
                          <div className="h-[200px] bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative shadow-inner flex items-center justify-center z-0">
                            {loc?.lat && loc?.lng ? (
                              <ReadOnlyMap 
                                lat={Number(loc.lat)} 
                                lng={Number(loc.lng)} 
                                radius={Number(loc.radius) || 100} 
                              />
                            ) : (
                              <div className="text-slate-400 text-sm font-medium flex items-center gap-2">
                                <MapPin size={16} /> Location Config Error
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 shrink-0">
                  <button
                    onClick={() => handleMarkAsDone(expandedAlarm)}
                    className={`col-span-2 flex items-center justify-center gap-2 px-4 py-4 ${colors.bg} hover:${colors.textDark} hover:shadow-lg hover:-translate-y-0.5 text-white font-bold rounded-2xl transition-all`}
                  >
                    <Check size={20} />
                    Mark as Done
                  </button>
                  <button
                    onClick={() => handleSnooze(expandedAlarm, 10)}
                    className="flex items-center justify-center gap-2 px-4 py-3.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-2xl transition-colors"
                  >
                    <Clock size={16} className="text-slate-400" />
                    Snooze 10 min
                  </button>
                  <button
                    onClick={() => handleDismiss(expandedAlarm)}
                    className="flex items-center justify-center gap-2 px-4 py-3.5 bg-transparent hover:bg-rose-50 text-slate-500 dark:text-slate-400 hover:text-rose-600 font-bold rounded-2xl transition-colors"
                  >
                    <X size={16} />
                    Dismiss
                  </button>
                </div>
              </motion.div>
                {/* Suggestions Sidebar */}
                {suggestedIdeas.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="w-full md:w-80 bg-white dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 shadow-xl pointer-events-auto h-fit shrink-0"
                    onClick={e => e.stopPropagation()}
                  >
                    <h3 className="text-slate-800 dark:text-slate-200 font-bold mb-4 font-display flex items-center gap-2">
                      <span className="opacity-80">✨</span> Reminders Suggestions
                    </h3>
                    <div className="flex flex-col gap-3">
                      <AnimatePresence>
                        {suggestedIdeas.map(suggestion => {
                          const suggestionColors = categoryColors[expandedAlarm.category?.color || 'indigo'] || categoryColors.indigo;
                          return (
                            <motion.div
                              key={suggestion.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-2 hover:shadow-md transition-shadow cursor-default"
                            >
                              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 break-words line-clamp-2">
                                {suggestion.title}
                              </h4>
                              <div className="flex items-center gap-1.5 mt-1">
                                <MapPin size={12} className={suggestionColors.text} />
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                                  {suggestion.loc}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </div>            </motion.div>
          );
        })()}
      </AnimatePresence>
    </>
  );
}

