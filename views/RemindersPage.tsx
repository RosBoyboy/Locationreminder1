import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Clock, Check, Archive, Plus, Loader2 } from 'lucide-react';
import { useReminders, useToggleReminderDone, useArchiveReminder } from '@/hooks/useReminders';
import { useCategories } from '@/hooks/useCategories';
import { useAppContext } from '@/context/AppContext';

export default function RemindersPage() {
  const { setIsReminderModalOpen } = useAppContext();
  const { data: ALL_REMINDERS, isLoading, isError } = useReminders();
  const { data: CATEGORIES } = useCategories();
  const { mutate: toggleDone } = useToggleReminderDone();
  const { mutate: archiveReminder } = useArchiveReminder();

  const CATEGORY_COLOR_MAP: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600 border border-indigo-200 dark:border-slate-700",
    rose: "bg-rose-50 text-rose-600 border border-rose-200 dark:border-slate-700",
    emerald: "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:border-slate-700",
    amber: "bg-amber-50 text-amber-600 border border-amber-200 dark:border-slate-700",
    purple: "bg-purple-50 text-purple-600 border border-purple-200 dark:border-slate-700",
    blue: "bg-blue-50 text-blue-600 border border-blue-200 dark:border-slate-700",
    orange: "bg-orange-50 text-orange-600 border border-orange-200 dark:border-slate-700"
  };
  const getCategoryColorClasses = (color?: string) => CATEGORY_COLOR_MAP[color || 'indigo'] || CATEGORY_COLOR_MAP['indigo'];

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const VISIBLE_REMINDERS = ALL_REMINDERS?.filter(r => !r.deleted_at) || [];

  const filteredReminders = VISIBLE_REMINDERS.filter((r) => {
    // test text search
    const titleMatch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = (r.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const locMatch = (r.location?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (searchQuery && !(titleMatch || descMatch || locMatch)) return false;
    
    // category filter
    if (filterCategory !== 'All' && r.category_id !== filterCategory) return false;
    
    // status filter
    if (filterStatus !== 'All') {
        if (filterStatus === 'Done' && !r.is_done) return false;
        if (filterStatus !== 'Done' && (r.is_done || r.status !== filterStatus)) return false;
    }
    
    return true;
  });

  const getRelativeDateText = (dateStr: string) => {
      const d = new Date(dateStr);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (d.toDateString() === today.toDateString()) return 'Today · ' + timeStr;
      if (d.toDateString() === yesterday.toDateString()) return 'Yesterday · ' + timeStr;
      if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow · ' + timeStr;
      return d.toLocaleDateString() + ' · ' + timeStr;
  };

  const statuses = ['All', 'Pending', 'Active', 'Done'];

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-500 dark:text-indigo-400" size={32} /></div>;
  if (isError) return <div className="flex justify-center p-20 text-rose-500 font-bold">Failed to load reminders. </div>;

  return (
    <div className="w-full flex-1 space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-[28px] font-bold text-slate-800 dark:text-slate-200 tracking-tight">Reminders</h1>
          <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-1 font-medium">{filteredReminders.length} of {VISIBLE_REMINDERS.length} reminders</p>
        </div>
        <button
          onClick={() => setIsReminderModalOpen(true)}
          className="hidden sm:flex bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-5 py-2.5 items-center justify-center gap-2 font-semibold text-[14px] shadow-[0_4px_14px_-4px_rgba(99,102,241,0.4)] transition-all"
        >
          <Plus size={18} /> New Reminder
        </button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
         <div className="relative flex-1 w-full relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search reminders..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-slate-200 shadow-sm"
            />
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
                onClick={() => setShowFilters(!showFilters)}
                className={(showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-500/20 dark:border-indigo-500/30' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300') + " flex items-center gap-2 px-4 py-2.5 border rounded-xl font-semibold text-[13px] shadow-sm transition-colors flex-1 md:flex-initial justify-center"}
            >
                <Filter size={16} /> Filters
            </button>
            <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-1">
                <button 
                    onClick={() => setViewMode('card')} 
                    className={(viewMode === 'card' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200') + " px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors"}
                >
                    Card
                </button>
                <button 
                    onClick={() => setViewMode('table')} 
                    className={(viewMode === 'table' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200') + " px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors"}
                >
                    Table
                </button>
            </div>
         </div>
      </div>

      <AnimatePresence>
        {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                <div>
                   <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Category</h4>
                   <div className="flex flex-wrap gap-2">
                     <button
                        onClick={() => setFilterCategory('All')}
                        className={(filterCategory === 'All' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800') + " px-4 py-1.5 rounded-full text-[13px] font-bold transition-all border"}
                     >
                         All
                     </button>
                     {CATEGORIES?.map(c => (
                         <button
                            key={c.id}
                            onClick={() => setFilterCategory(c.id)}
                            className={(filterCategory === c.id ? `${getCategoryColorClasses(c.color)} font-bold shadow-sm` : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800') + " flex flex-row items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all"}
                         >
                             <span>{c.icon}</span> {c.name}
                         </button>
                     ))}
                   </div>
                </div>
                <div>
                   <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Status</h4>
                   <div className="flex flex-wrap gap-2">
                     {statuses.map(s => (
                         <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={(filterStatus === s ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800') + " px-4 py-1.5 rounded-full text-[13px] font-bold transition-all border"}
                         >
                             {s}
                         </button>
                     ))}
                   </div>
                </div>
              </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Grid View mode */}
      {viewMode === 'card' && (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">    
        {filteredReminders.map((r, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={r.id}
            className={(r.is_done ? 'border-slate-200 dark:border-slate-800/60 opacity-80' : 'border-slate-200 dark:border-slate-800') + ' bg-white dark:bg-slate-900 border rounded-2xl p-5 pb-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md hover:border-indigo-100 transition-all group'}   
          >
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className={(r.is_done ? 'text-slate-500 dark:text-slate-400 line-through decoration-slate-300 pointer-events-none' : 'text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:text-indigo-400 transition-colors') + ' font-bold text-[16px] truncate pr-2'}>
                  {r.title}
                </h3>
                <span className={(r.status === 'Done' ? 'bg-emerald-50 text-emerald-600' : r.status === 'Active' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600') + ' px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0'}>
                  {r.status}
                </span>
              </div>

              <p className={(r.is_done ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400') + ' text-[13.5px] font-medium mb-4 line-clamp-2 leading-relaxed'}>
                {r.description || "No description provided."}
              </p>

              <div className="flex flex-col gap-3 mb-4">
                 <div className="flex items-center gap-1.5 text-[12px] font-semibold text-indigo-400">
                   <MapPin size={14} className="text-indigo-400 opacity-80" />  
                   <span className={r.is_done ? 'text-slate-400 truncate' : 'text-slate-500 dark:text-slate-400 truncate'}>
                     {r.location?.name || r.location_id || "Anywhere"}
                   </span>
                 </div>
                 <div className="flex justify-between items-center mt-1">       
                   <div className={`${getCategoryColorClasses(r.category?.color)} flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-bold shadow-sm`}>
                      <span className="text-[12px]">{r.category?.icon || '📌'}</span> {r.category?.name || 'Uncategorized'}
                   </div>
                   <div className="text-[11px] font-medium text-slate-400">     
                     {getRelativeDateText(r.created_at)}
                   </div>
                 </div>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-1 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 w-full">
              {r.is_done ? (
                <button onClick={() => toggleDone({ id: r.id, is_done: false })} className="flex items-center justify-center gap-1.5 py-1.5 text-[13px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 transition-colors flex-1 w-full rounded hover:bg-slate-50 dark:bg-slate-800">   
                  <Clock size={15} className="opacity-70" /> Restore
                </button>
              ) : (
                <button onClick={() => toggleDone({ id: r.id, is_done: true })} className="flex items-center justify-center gap-1.5 py-1.5 text-[13px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex-1 w-full rounded hover:bg-emerald-50">
                  <Check size={16} strokeWidth={3} /> Done
                </button>
              )}
              <div className="w-px h-5 bg-slate-100 dark:bg-slate-800 shrink-0"></div>
              <button
                  onClick={() => archiveReminder(r.id)}
                className="text-slate-300 hover:text-amber-500 transition-colors px-2 py-1.5 rounded hover:bg-amber-50 flex items-center justify-center shrink-0"
               >
                 <Archive size={17} />
              </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      )}

      {/* Table View mode */}
      {viewMode === 'table' && (
         <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden overflow-x-auto"
         >
             <table className="w-full text-left border-collapse min-w-[700px]">
                 <thead>
                     <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                         <th className="py-3 px-5 text-[11px] font-bold tracking-wider text-slate-500 uppercase">Title</th>
                         <th className="py-3 px-5 text-[11px] font-bold tracking-wider text-slate-500 uppercase">Location</th>
                         <th className="py-3 px-5 text-[11px] font-bold tracking-wider text-slate-500 uppercase">Category</th>
                         <th className="py-3 px-5 text-[11px] font-bold tracking-wider text-slate-500 uppercase text-center">Status</th>
                         <th className="py-3 px-5 text-[11px] font-bold tracking-wider text-slate-500 uppercase">Date</th>
                         <th className="py-3 px-5 text-[11px] font-bold tracking-wider text-slate-500 uppercase text-right">Actions</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                     {filteredReminders.map((r, i) => (
                         <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                             <td className="py-3 px-5">
                                <div className="flex flex-col">
                                    <span className={(r.is_done ? 'line-through decoration-slate-300 text-slate-400' : 'text-slate-800 dark:text-slate-200') + " font-bold text-[14px]"}>{r.title}</span>
                                    <span className="text-[12px] text-slate-500 truncate max-w-[200px] xl:max-w-[280px]">{r.description || "No description"}</span>
                                </div>
                             </td>
                             <td className="py-3 px-5">
                                 <div className="flex items-center gap-1.5 text-[13px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                                     <MapPin size={14} className="text-indigo-400" />
                                     <span className="truncate max-w-[150px]">{r.location?.name || r.location_id || "-"}</span>
                                 </div>
                             </td>
                             <td className="py-3 px-5 whitespace-nowrap">
                                <div className={`${getCategoryColorClasses(r.category?.color)} inline-flex flex-row items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold`}>
                                    <span>{r.category?.icon || '📌'}</span> {r.category?.name || 'Uncategorized'}
                                </div>
                             </td>
                             <td className="py-3 px-5 text-center">
                                <span className={(r.status === 'Done' ? 'bg-emerald-50 text-emerald-600' : r.status === 'Active' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600') + ' px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider '}>
                                    {r.status}
                                </span>
                             </td>
                             <td className="py-3 px-5 whitespace-nowrap text-[13px] text-slate-500 font-medium">
                                {getRelativeDateText(r.created_at).split(' · ')[0]}
                             </td>
                             <td className="py-3 px-5">
                                 <div className="flex justify-end items-center gap-4">
                                     {r.is_done ? (
                                         <button onClick={() => toggleDone({ id: r.id, is_done: false })} className="text-slate-400 hover:text-slate-600 transition-colors" title="Restore">
                                            <Clock size={16} />
                                         </button>
                                     ) : (
                                         <button onClick={() => toggleDone({ id: r.id, is_done: true })} className="text-emerald-500 hover:text-emerald-600 transition-colors" title="Mark Done">
                                            <Check size={18} strokeWidth={2.5} />
                                         </button>
                                     )}
                                     <button onClick={() => archiveReminder(r.id)} className="text-amber-400 hover:text-amber-600 transition-colors" title="Archive">
                                         <Archive size={16} />
                                     </button>
                                 </div>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </motion.div>
      )}

      {filteredReminders.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-500 dark:text-slate-400 font-medium">
            No reminders match your filters.
          </div>
      )}
    </div>
  );
}