import React, { useState } from 'react';
import { CheckCircle2, Check, Clock, Plus, Loader2, MapPin, Trash2, ChevronLeft } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useToggleReminderDone, useArchiveReminder } from '@/hooks/useReminders';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

const getColorClasses = (color: string) => {
  const map: Record<string, { bg: string, text: string, fill: string, border: string }> = {
    indigo: { bg: "bg-indigo-500/20", text: "text-indigo-600 dark:text-indigo-400", fill: "bg-indigo-500 hover:bg-indigo-600 text-white", border: "border-indigo-500" },
    rose: { bg: "bg-rose-50", text: "text-rose-500", fill: "bg-rose-500", border: "border-rose-500" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-500", fill: "bg-emerald-500", border: "border-emerald-500" },
    amber: { bg: "bg-amber-50", text: "text-amber-500", fill: "bg-amber-500", border: "border-amber-500" },
    purple: { bg: "bg-purple-50", text: "text-purple-500", fill: "bg-purple-500", border: "border-purple-500" },
    blue: { bg: "bg-blue-50", text: "text-blue-500", fill: "bg-blue-500", border: "border-blue-500" },
    orange: { bg: "bg-orange-50", text: "text-orange-500", fill: "bg-orange-500", border: "border-orange-500" }
  };
  return map[color] || map.indigo;
};

export default function CategoriesPage() {
  const { data: categories, isLoading, isError } = useCategories();
  const { mutate: toggleDone } = useToggleReminderDone();
  const { mutate: archiveReminder } = useArchiveReminder();
  const queryClient = useQueryClient();
  const [isInitializing, setIsInitializing] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const handleSeed = async () => {
    setIsInitializing(true);
    try {
      const { createClient } = await import('@/utils/supabase/client');
      const supabase = createClient();
      const { authService } = await import('@/services/authService');
      const user = await authService.getCurrentUser();
      
      if (!user) throw new Error('Not authenticated');

      const seedData = [
        { user_id: user.id, name: 'Work', color: 'blue', icon: '💼', description: 'Office tasks, meetings, deadlines' },
        { user_id: user.id, name: 'Personal', color: 'rose', icon: '🏠', description: 'Home chores, personal goals' },
        { user_id: user.id, name: 'School', color: 'emerald', icon: '🎓', description: 'Classes, assignments, study groups' },
        { user_id: user.id, name: 'Shopping', color: 'amber', icon: '🛒', description: 'Groceries, errands, pickups' },
        { user_id: user.id, name: 'Health', color: 'purple', icon: '🏥', description: 'Doctor visits, medications, gym' }
      ];

      const { data: newCats, error } = await supabase.from('categories').insert(seedData).select("*");
      if (error) throw error;

      // Fix any uncategorized reminders
      const { data: reminders } = await supabase.from('reminders').select('*').is('category_id', null);
      if (reminders && reminders.length > 0 && newCats) {
        for (const rem of reminders) {
          let chosenCat = newCats.find(c => c.name === 'Personal');
          const title = (rem.title || '').toLowerCase();
          
          if (title.includes('grocer') || title.includes('buy') || title.includes('pick') || title.includes('errand')) {
            chosenCat = newCats.find(c => c.name === 'Shopping') || chosenCat;
          } else if (title.includes('project') || title.includes('submit') || title.includes('office') || title.includes('report') || title.includes('work')) {
            chosenCat = newCats.find(c => c.name === 'Work') || chosenCat;
          } else if (title.includes('study') || title.includes('school') || title.includes('class') || title.includes('assignment')) {
            chosenCat = newCats.find(c => c.name === 'School') || chosenCat;
          } else if (title.includes('medication') || title.includes('prescription') || title.includes('gym') || title.includes('doctor')) {
            chosenCat = newCats.find(c => c.name === 'Health') || chosenCat;
          }

          if (chosenCat) {
             await supabase.from('reminders').update({ category_id: chosenCat.id }).eq('id', rem.id);
          }
        }
      }

      await queryClient.invalidateQueries({ queryKey: ['categories'] });
      await queryClient.invalidateQueries({ queryKey: ['reminders'] });
    } catch(e) {
      console.error('Seed Error', e);
    } finally {
      setIsInitializing(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-500 dark:text-indigo-400" size={32} /></div>;
  if (isError) return <div className="flex justify-center p-20 text-rose-500 font-bold">Failed to load categories.</div>;
  const selectedCategory = selectedCategoryId ? categories?.find(c => c.id === selectedCategoryId) : null;

  if (selectedCategory) {
    const colors = getColorClasses(selectedCategory.color);
    const reminders = (selectedCategory.reminders || []).filter((r: any) => !r.deleted_at);
    
    return (
      <div className="w-full flex-1 space-y-6">
         <button onClick={() => setSelectedCategoryId(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors font-medium mb-2 text-[14px]">
           <ChevronLeft size={16} /> Back to Categories
         </button>
         
         <div className="flex justify-between items-center mb-8">
           <div className="flex gap-4 items-center">
               <div className={"w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm " + colors.bg}>
                 {selectedCategory.icon}
               </div>
               <div>
                 <h1 className="text-[28px] font-bold text-slate-800 dark:text-slate-200 tracking-tight">{selectedCategory.name}</h1>
                 <p className="text-[14px] text-slate-500 dark:text-slate-400 font-medium mt-1">{selectedCategory.description}</p>
               </div>
           </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {reminders.map((r: any, i: number) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={r.id} 
                className={(r.is_done ? 'border-slate-200 dark:border-slate-800/60' : 'border-slate-200 dark:border-slate-800') + ' bg-white dark:bg-slate-900 border rounded-2xl p-5 pb-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md hover:border-indigo-100 transition-all group'}
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={(r.is_done ? 'text-slate-500 dark:text-slate-400 line-through decoration-slate-300 pointer-events-none' : 'text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:text-indigo-400 transition-colors') + ' font-bold text-[15px]'}>
                      {r.title}
                    </h3>
                    <span className={(r.status === 'Done' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600') + ' px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider '}>
                      {r.is_done ? 'Done' : 'Active'}
                    </span>
                  </div>
                  
                  <p className={(r.is_done ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400') + ' text-[13px] font-medium mb-4'}>
                    {r.description || "No description provided."}
                  </p>
                  
                  <div className="flex flex-col gap-3 mb-4">
                     <div className="flex items-center gap-1.5 text-[12px] font-semibold text-indigo-400">
                       <MapPin size={13} className="text-indigo-400 opacity-80" />
                       <span className={r.is_done ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}>
                         {r.location?.name || r.location_id || "Anywhere"}
                       </span>
                     </div>
                     <div className="flex justify-between items-center mt-1">
                       <div className={(selectedCategory?.color ? `${getColorClasses(selectedCategory.color).bg} ${getColorClasses(selectedCategory.color).text}` : `${getColorClasses('indigo').bg} ${getColorClasses('indigo').text}`) + ' flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-bold shadow-sm'}>
                          <span>{selectedCategory?.icon || '??'}</span> {selectedCategory?.name || 'Uncategorized'}
                       </div>
                       <div className="text-[11px] font-medium text-slate-400">
                         {new Date(r.created_at).toLocaleDateString()}
                       </div>
                     </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-1 flex items-center justify-between">
                  {r.is_done ? (
                    <button onClick={(e) => { e.stopPropagation(); toggleDone({ id: r.id, is_done: false }); }} className="flex items-center justify-center gap-1.5 py-1 text-[13px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex-1 w-full rounded hover:bg-slate-50 dark:hover:bg-slate-800">
                      <Clock size={14} /> Restore
                    </button>
                  ) : (
                    <button onClick={(e) => { e.stopPropagation(); toggleDone({ id: r.id, is_done: true }); }} className="flex items-center justify-center gap-1.5 py-1 text-[13px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors flex-1 w-full rounded hover:bg-emerald-50 dark:hover:bg-emerald-500/20">
                      <Check size={14} strokeWidth={2.5} /> Done
                    </button>
                  )}
                  <div className="w-px h-5 bg-slate-100 dark:bg-slate-800 mx-2"></div>
                  <button 
                      onClick={(e) => { e.stopPropagation(); archiveReminder(r.id); }} 
                    className="text-slate-300 hover:text-rose-500 transition-colors px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-500/20 flex items-center justify-center"
                   >
                     <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}

            {reminders?.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-500 dark:text-slate-400 font-medium">
                You don't have any reminders in this category yet.
              </div>
            )}
         </div>
      </div>
    );
  }
  return (
    <div className="w-full flex-1 space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-slate-800 dark:text-slate-200 tracking-tight">Categories</h1>
          <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Organize your reminders by category</p>
        </div>
        <div className="flex gap-3">
          {categories?.length === 0 && (
            <button 
              onClick={handleSeed}
              disabled={isInitializing}
              className="flex bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-5 py-2.5 items-center justify-center gap-2 font-semibold text-[14px] shadow-[0_4px_14px_-4px_rgba(245,158,11,0.4)] transition-all disabled:opacity-50"
            >
              {isInitializing ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} 
              {isInitializing ? "Initializing..." : "Seed Default Categories"}
            </button>
          )}
          
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories?.map((cat) => {
          const colors = getColorClasses(cat.color);
          const reminders = (cat.reminders || []).filter((r: any) => !r.deleted_at);
          const total = reminders.length;
          const doneCount = reminders.filter((r: { is_done: boolean }) => r.is_done).length;     
          const pendingCount = total - doneCount;
          const progress = total === 0 ? 0 : Math.round((doneCount / total) * 100);

          return (
            <div 
              key={cat.id} 
              onClick={() => setSelectedCategoryId(cat.id)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all flex flex-col min-h-55 cursor-pointer relative group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent dark:via-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className={"w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm mb-1 " + colors.bg}>
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-[18px] text-slate-800 dark:text-slate-200">{cat.name}</h3>
                    <p className="text-[13px] text-slate-400 font-medium leading-tight mt-0.5">{cat.description || "No description"}</p>
                  </div>
                </div>
                <span className={"text-[20px] font-bold tracking-tight " + colors.text}>{total}</span>
              </div>

              <div className="mt-auto">
                <div className="flex justify-between text-[12px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  <span>Completion</span>
                  <span className={colors.text}>{progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div className={"h-full rounded-full " + colors.fill} style={{ width: progress + "%" }}></div>
                </div>

                <div className="flex flex-wrap gap-3 text-[12px] font-semibold text-slate-400 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1 text-emerald-500"><CheckCircle2 size={14} /> {doneCount} done</div>
                  <div className="flex items-center gap-1 text-amber-500"><Clock size={14} /> {pendingCount} pending</div>
                </div>

                <div className="space-y-2">
                  {reminders.slice(0, 3).map((item: { title: string, is_done: boolean }, idx: number) => (      
                    <div key={idx} className="flex items-center gap-2 truncate">
                      <div className={"w-1.5 h-1.5 rounded-full shrink-0 " + colors.fill}></div>
                      <span className={"text-[13px] font-medium truncate " + (item.is_done ? 'text-slate-400 line-through' : 'text-slate-600 dark:text-slate-400')}>{item.title}</span>
                    </div>
                  ))}
                  {reminders.length > 3 && (
                    <div className="text-[12px] text-slate-400 font-medium pl-3 italic">+{reminders.length - 3} more...</div>
                  )}
                  {reminders.length === 0 && (
                     <div className="text-[12px] text-slate-400 font-medium italic">No reminders in this category.</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {categories?.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-500 dark:text-slate-400 font-medium">
            You don&apos;t have any categories yet.
          </div>
        )}
      </div>
    </div>
  );
}

