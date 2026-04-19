const fs = require('fs');

const content = import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellRing, Check, Clock, MapPin, X, Navigation, Calendar, MoveRight } from 'lucide-react';
import { Reminder } from '@/types/models';
import { useGeofencing } from '@/hooks/useGeofencing';
import { useUpdateReminder } from '@/hooks/useReminders';
import LocationMap from '@/components/map/LocationMap';

const categoryColors: Record<string, { bg: string, bgSoft: string, text: string, textDark: string, border: string }> = {
  indigo: { bg: 'bg-indigo-500', bgSoft: 'bg-indigo-50', text: 'text-indigo-500', textDark: 'text-indigo-600', border: 'border-indigo-500' },
  emerald: { bg: 'bg-emerald-500', bgSoft: 'bg-emerald-50', text: 'text-emerald-500', textDark: 'text-emerald-600', border: 'border-emerald-500' },
  rose: { bg: 'bg-rose-500', bgSoft: 'bg-rose-50', text: 'text-rose-500', textDark: 'text-rose-600', border: 'border-rose-500' },
  amber: { bg: 'bg-amber-500', bgSoft: 'bg-amber-50', text: 'text-amber-500', textDark: 'text-amber-600', border: 'border-amber-500' },
  blue: { bg: 'bg-blue-500', bgSoft: 'bg-blue-50', text: 'text-blue-500', textDark: 'text-blue-600', border: 'border-blue-500' },
  purple: { bg: 'bg-purple-500', bgSoft: 'bg-purple-50', text: 'text-purple-500', textDark: 'text-purple-600', border: 'border-purple-500' },
  sky: { bg: 'bg-sky-500', bgSoft: 'bg-sky-50', text: 'text-sky-500', textDark: 'text-sky-600', border: 'border-sky-500' },
};

export default function ActiveReminderModal() {
  const { activeAlarms, snoozeAlarm, dismissAlarm } = useGeofencing();
  const [expandedAlarmId, setExpandedAlarmId] = useState<string | null>(null);
  const { mutate: updateReminder } = useUpdateReminder();

  React.useEffect(() => {
    if (activeAlarms.length > 0) {
      if (expandedAlarmId === null && activeAlarms.length === 1) {
        // Just triggered
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
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } catch (e) {
        console.error("Audio fail", e);
      }
    }
  }, [activeAlarms.length, expandedAlarmId]);

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

  const expandedAlarm = activeAlarms.find(a => a.id === expandedAlarmId);

  return (
    <>
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
                className={\g-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden pointer-events-auto shrink-0 flex flex-col relative border-t-4 \\}
              >
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="relative flex items-center justify-center w-3 h-3">
                        <span className={\bsolute inline-flex h-full w-full rounded-full \ opacity-30 animate-ping\} />
                        <span className={\elative inline-flex rounded-full h-2 w-2 \\} />
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{alarm.title}</h3>
                    </div>
                    <button onClick={() => dismissAlarm(alarm.id)} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                      <X size={16} />
                    </button>
                  </div>

                  {alarm.description && (
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 pr-4">{alarm.description}</p>
                  )}

                  <button 
                    onClick={() => setExpandedAlarmId(alarm.id)}
                    className={\	ext-xs font-bold \ hover:underline flex items-center gap-1 mt-1 shrink-0 w-fit\}
                  >
                    View full reminder details <MoveRight size={12} />
                  </button>

                  <div className="flex items-center gap-2 mt-2 pt-3 border-t border-slate-50">
                    <button
                      onClick={() => handleMarkAsDone(alarm)}
                      className={\lex-1 py-2 rounded-lg text-xs font-bold \ \ hover:\ hover:text-white transition-colors\}
                    >
                      Done
                    </button>
                    <button
                      onClick={() => handleSnooze(alarm, 10)}
                      className="flex-1 py-2 rounded-lg text-xs font-bold bg-slate-100/80 text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      Snooze
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

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
              <motion.div
                initial={{ scale: 0.95, y: 15, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 15, opacity: 0 }}
                className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
              >
                <div className={\\ p-6 sm:p-8 flex flex-col relative shrink-0 transition-colors duration-300\}>
                  <button onClick={() => setExpandedAlarmId(null)} className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <div className="bg-white/20 p-2 rounded-xl text-white backdrop-blur-sm relative z-10 w-12 h-12 flex items-center justify-center">
                        <BellRing size={24} />
                      </div>
                      <div className="absolute top-0 -right-1 z-20 w-3.5 h-3.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-50 animate-ping" />
                        <span className="relative inline-flex rounded-full h-full w-full bg-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-white/80 font-bold text-xs uppercase tracking-wider mb-0.5">Location Triggered</p>
                      <h2 className="text-white text-sm font-semibold">You've arrived at the zone!</h2>
                    </div>
                  </div>

                  <h1 className="text-white text-3xl font-black tracking-tight leading-tight mix-blend-overlay break-words">{expandedAlarm.title}</h1>
                  
                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    {expandedAlarm.category?.name && (
                      <span className="px-3 py-1.5 bg-black/15 backdrop-blur-md rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1.5">
                        <span className="opacity-80">📁</span> {expandedAlarm.category.name}
                      </span>
                    )}
                    <span className="px-3 py-1.5 bg-white text-slate-800 rounded-full text-xs font-bold shadow-sm">
                      Active
                    </span>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 bg-slate-50/50">
                  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm col-span-2">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <Clock size={14} />
                      <span className="text-xs font-bold uppercase tracking-wider">Description</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">
                      {expandedAlarm.description || <span className="italic text-slate-400">No additional notes provided.</span>}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 shrink-0">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MapPin size={13} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Location</span>
                      </div>
                      <span className="text-slate-800 font-bold text-sm truncate">{expandedAlarm.location?.name || "Local Trigger"}</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Navigation size={13} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Radius</span>
                      </div>
                      <span className="text-slate-800 font-bold text-sm truncate">{expandedAlarm.location?.radius || 100}m geofence</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar size={13} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Date</span>
                      </div>
                      <span className="text-slate-800 font-bold text-sm truncate">Today, {currentDate}</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock size={13} className="text-slate-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Time</span>
                      </div>
                      <span className="text-slate-800 font-bold text-sm truncate">{currentTime}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <div className="flex items-center gap-2 text-slate-400 px-1">
                      <MapPin size={14} />
                      <span className="text-xs font-bold uppercase tracking-wider">Geofence Map</span>
                    </div>
                    <div className="h-40 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative shadow-inner">
                      {expandedAlarm.location && expandedAlarm.location.lat && expandedAlarm.location.lng ? (
                        <>
                          <LocationMap
                            selectedLocation={null}
                            onLocationSelect={() => {}}
                            mode="view"
                            center={[expandedAlarm.location.lat, expandedAlarm.location.lng]}
                            zoom={16}
                            markers={[{
                              id: expandedAlarm.id,
                              lat: expandedAlarm.location.lat,
                              lng: expandedAlarm.location.lng,
                              title: expandedAlarm.title,
                              color: '#ffffff',
                              bgColor: '#3b82f6'
                            }]}
                          />
                          <div className="absolute inset-0 z-[1000] bg-transparent pointer-events-auto" onClick={(e) => { e.stopPropagation(); }} />
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm font-medium">Map Unavailable</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white border-t border-slate-100 grid grid-cols-2 gap-3 shrink-0">
                  <button
                    onClick={() => handleMarkAsDone(expandedAlarm)}
                    className={\col-span-2 flex items-center justify-center gap-2 px-4 py-4 \ hover:\ hover:shadow-lg hover:-translate-y-0.5 text-white font-bold rounded-2xl transition-all\}
                  >
                    <Check size={20} />
                    Mark as Done
                  </button>
                  <button
                    onClick={() => handleSnooze(expandedAlarm, 10)}
                    className="flex items-center justify-center gap-2 px-4 py-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-600 font-bold rounded-2xl transition-colors"
                  >
                    <Clock size={16} className="text-slate-400" />
                    Snooze 10 min
                  </button>
                  <button
                    onClick={() => handleDismiss(expandedAlarm)}
                    className="flex items-center justify-center gap-2 px-4 py-3.5 bg-transparent hover:bg-rose-50 text-slate-500 hover:text-rose-600 font-bold rounded-2xl transition-colors"
                  >
                    <X size={16} />
                    Dismiss
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </>
  );
}
;

fs.writeFileSync('components/reminders/ActiveReminderModal.tsx', content);
