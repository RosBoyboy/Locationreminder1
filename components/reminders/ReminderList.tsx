"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { MapPin, Navigation, Tag, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";

type Reminder = {
  id: string;
  title: string;
  description: string;
  radius_meters: number;
  is_active: boolean;
};

export function ReminderList() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchReminders = async () => {
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .order("created_at", { ascending: false });

      if (data && !error) {
        setReminders(data);
      }
      setIsLoading(false);
    };
    fetchReminders();

    const channel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reminders" },
        () => {
          fetchReminders();
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); }
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex justify-between items-start mb-3">
              <div className="h-5 bg-slate-200 rounded w-1/2"></div>
              <div className="h-5 bg-slate-200 rounded w-16"></div>
            </div>
            <div className="h-4 bg-slate-100 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (reminders.length === 0) {
    return (
      <div className="text-center text-sm text-slate-400 flex flex-col items-center gap-3 p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-white shadow-sm">
        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-indigo-400 mb-2">
          <MapPin size={24} />
        </div>
        <p className="max-w-[200px] leading-relaxed">No triggers active. Drop a pin on the map to set one.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-8">
      {reminders.map((r, i) => (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          key={r.id} 
          className="group flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all p-4 relative overflow-hidden"
        >
          {/* subtle left colored border indicator */}
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${r.is_active ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
          
          <div className="flex justify-between items-start pl-2">
            <div className="flex-1 min-w-0 pr-3">
              <h3 className="font-semibold text-slate-800 text-[15px] truncate">{r.title}</h3>
              {r.description && (
                 <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{r.description}</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${r.is_active ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                {r.is_active ? "Active" : "Done"}
              </span>
              <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-slate-50/50 flex items-center justify-between text-xs text-slate-500 pl-2">
             <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
               <Navigation size={12} className="text-slate-400" />
               <span>{r.radius_meters}m radius</span>
             </div>
             <div className="flex items-center gap-1.5">
               <Tag size={12} className="text-slate-400"/>
               <span>Generic</span>
             </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}