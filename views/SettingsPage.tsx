import React, { useState, useEffect } from 'react';
import { MapPin, Bell, Moon, Save, ChevronRight, Smartphone, Globe, Shield, Loader2, CheckCircle2, Settings as SettingsIcon, Archive, ArchiveRestore, Trash2, Search, Filter, Clock } from 'lucide-react';
import { authService } from '@/services/authService';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useReminders, useRestoreReminder, useDeleteReminder, REMINDERS_KEY } from '@/hooks/useReminders';
import { useTheme } from 'next-themes';
import { useAppContext } from '@/context/AppContext';

const Toggle = ({ active, onChange }: { active: boolean, onChange: () => void }) => (
  <div
    onClick={onChange}
    className={`w-[42px] h-6 rounded-full flex items-center px-1 transition-colors cursor-pointer ${active ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : 'bg-slate-200'}`}
  >
    <div className={`w-4 h-4 bg-white dark:bg-slate-900 rounded-full shadow-sm transform transition-transform ${active ? 'translate-x-4' : 'translate-x-0'}`}></div>
  </div>
);

export default function SettingsPage() {
  const { setActiveTab } = useAppContext();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSavedData, setShowSavedData] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const settingsKey = React.useMemo(
    () => user ? `georemind_settings_${user.id}` : 'georemind_settings_guest',
    [user]
  );
  
  // Custom Tab Navigation
  const [activeSettingsTab, setActiveSettingsTab] = useState<'general' | 'archive'>('general');
  const CATEGORY_COLOR_MAP: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
  };
  const getCategoryColorClasses = (color?: string) => CATEGORY_COLOR_MAP[color || 'indigo'] || CATEGORY_COLOR_MAP['indigo'];

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isClearingArchives, setIsClearingArchives] = useState(false);

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const handleBulkDeleteArchive = async () => {
    if (!confirm('Clear all archives permanently?')) return;
    setIsClearingArchives(true);
    let failed = 0;
    for (const r of archivedReminders) {
      try {
        await deleteReminder(r.id);
      } catch (err) {
        failed++;
      }
    }
    setIsClearingArchives(false);
    if (failed > 0) alert(`Completed with ${failed} failures.`);
  };
  
  const queryClient = useQueryClient();
  const { theme, setTheme, resolvedTheme } = useTheme();
  // For hydration mismatch fixes with next-themes
  const [mounted, setMounted] = useState(false);

  const { mutate: restoreReminder } = useRestoreReminder();
  const { mutate: deleteReminder } = useDeleteReminder();

  const [settings, setSettings] = useState({
    locationPermissions: true,
    backgroundLocation: true,
    autoRadius: false,
    pushNotifications: true,
    soundAlerts: true,
    vibration: true,
    darkMode: false
  });

  useEffect(() => {
    setMounted(true);
    authService.getCurrentUser().then(u => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const saved = localStorage.getItem(settingsKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
      } catch (e) {
        console.warn(e);
      }
    }
  }, [mounted, settingsKey]);

  useEffect(() => {
    if (mounted) {
      setSettings(prev => ({ ...prev, darkMode: theme === 'dark' || resolvedTheme === 'dark' }));
    }
  }, [theme, mounted]);

  const { data: ALL_REMINDERS } = useReminders();

  const handleToggle = (key: keyof typeof settings) => {
    if (key === 'darkMode') {
      const newDarkMode = !settings.darkMode;
      setSettings(prev => ({ ...prev, darkMode: newDarkMode }));
      setTheme(newDarkMode ? 'dark' : 'light');
    } else {
      setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem(settingsKey, JSON.stringify(settings));
      setSaving(false);
      setShowSavedData(true);
      setTimeout(() => setShowSavedData(false), 3000);
    }, 600);
  };

  const handleDeleteAll = async () => {
    if (!user) return;
    if (confirm('Are you absolutely sure you want to permanently delete all your active reminders?')) {
      setIsDeletingAll(true);
      try {
        const supabase = createClient();
        const { error } = await supabase.from('reminders').delete().eq('user_id', user.id).neq('status', 'Archived');
        if (!error) {
          queryClient.invalidateQueries({ queryKey: REMINDERS_KEY });
          alert('All non-archived reminders deleted successfully.');
        } else {
            console.error('Delete error', error)
        }
      } catch (err) {
        console.error(err);
      }
      setIsDeletingAll(false);
    }
  };

  // Get user initials securely
  const getInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 2).toUpperCase();
  };

  // Get fake HTTPS status for PWA
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-500 dark:text-indigo-400" size={32} /></div>;

  const archivedReminders = ALL_REMINDERS?.filter((r: any) => !!r.deleted_at) || [];
  const filteredArchive = archivedReminders.filter((r: any) => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (r.location?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!mounted) return null;

  return (
    <div className="w-full flex-1 space-y-6 pb-20">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-slate-800 dark:text-slate-200 tracking-tight">Settings</h1>
        <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage your preferences and account</p>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <button 
          onClick={() => setActiveSettingsTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[10px] font-bold text-[14px] transition-colors ${activeSettingsTab === 'general' ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
        >
          <SettingsIcon size={18} /> General
        </button>
        <button 
          onClick={() => setActiveSettingsTab('archive')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[10px] font-bold text-[14px] transition-colors ${activeSettingsTab === 'archive' ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
        >
          <Archive size={18} className={activeSettingsTab === 'archive' ? 'text-slate-800 dark:text-slate-200' : ''} /> 
          Archive {archivedReminders.length > 0 && <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 text-[11px] px-1.5 py-0.5 rounded-full ml-1">{archivedReminders.length}</span>}
        </button>
      </div>

      {activeSettingsTab === 'general' ? (
      <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">

        <div className="space-y-6">
          {/* Location Permissions */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] px-6 py-5 shadow-sm">
            <div className="flex items-center gap-3 mb-6 bg-slate-50 dark:bg-slate-800 w-fit px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              <MapPin size={16} className="text-indigo-600 dark:text-indigo-400" /> <span className="font-bold text-[14px]">Location</span>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[14px] font-bold text-slate-800 dark:text-slate-200">Location Permissions</h4>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Allow app to access your location</p>
                </div>
                <Toggle active={settings.locationPermissions} onChange={() => handleToggle('locationPermissions')} />
              </div>
              <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[14px] font-bold text-slate-800 dark:text-slate-200">Background Location</h4>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Track location even when app is closed</p>
                </div>
                <Toggle active={settings.backgroundLocation} onChange={() => handleToggle('backgroundLocation')} />
              </div>
              <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[14px] font-bold text-slate-800 dark:text-slate-200">Auto Radius</h4>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Automatically adjust geofence radius</p>
                </div>
                <Toggle active={settings.autoRadius} onChange={() => handleToggle('autoRadius')} />
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] px-6 py-5 shadow-sm">
            <div className="flex items-center gap-3 mb-6 bg-slate-50 dark:bg-slate-800 w-fit px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              <Bell size={16} className="text-amber-500" /> <span className="font-bold text-[14px]">Notifications</span>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[14px] font-bold text-slate-800 dark:text-slate-200">Push Notifications</h4>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Receive reminder alerts</p>
                </div>
                <Toggle active={settings.pushNotifications} onChange={() => handleToggle('pushNotifications')} />
              </div>
              <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[14px] font-bold text-slate-800 dark:text-slate-200">Sound Alerts</h4>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Play sound when reminder triggers</p>
                </div>
                <Toggle active={settings.soundAlerts} onChange={() => handleToggle('soundAlerts')} />
              </div>
              <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[14px] font-bold text-slate-800 dark:text-slate-200">Vibration</h4>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Vibrate on location trigger</p>
                </div>
                <Toggle active={settings.vibration} onChange={() => handleToggle('vibration')} />
              </div>
            </div>
          </section>

          {/* Appearance */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] px-6 py-5 shadow-sm">
            <div className="flex items-center gap-3 mb-6 bg-slate-50 dark:bg-slate-800 w-fit px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              <Moon size={16} className="text-purple-500" /> <span className="font-bold text-[14px]">Appearance</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[14px] font-bold text-slate-800 dark:text-slate-200">Dark Mode</h4>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Switch to dark theme</p>
              </div>
              <Toggle active={settings.darkMode} onChange={() => handleToggle('darkMode')} />
            </div>
          </section>

          <button 
            onClick={handleSave}
            disabled={saving || showSavedData}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white hover:bg-indigo-600 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white rounded-[12px] py-3.5 flex items-center justify-center gap-2 font-bold text-[14px] transition-colors shadow-sm"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : showSavedData ? <CheckCircle2 size={18} /> : <Save size={18} />}
            {saving ? 'Saving...' : showSavedData ? 'Settings Saved!' : 'Save Settings'}
          </button>
        </div>

        <div className="space-y-6">
          {/* Account */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] p-6 shadow-sm">
            <h2 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mb-5">Account</h2>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white text-[14px] font-bold flex items-center justify-center shadow-sm shrink-0">
                {getInitials()}
              </div>
              <div className="min-w-0">
                <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-200 leading-tight truncate">{user?.email?.split('@')[0] || 'User'}</h3>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium truncate">{user?.email || 'user@example.com'}</p>
              </div>
            </div>

            <div className="space-y-2">
              {([
                { label: 'Edit Profile', action: () => setActiveTab('account') },
                { label: 'Change Password', action: () => setActiveTab('account') },
                { label: 'Privacy Policy', action: () => {} },
                { label: 'Terms of Service', action: () => {} }
              ] as { label: string; action: () => void; disabled?: boolean; tooltip?: string }[]).map((item, i) => (
                <button key={i} onClick={item.disabled ? undefined : item.action} disabled={item.disabled} title={item.tooltip} className={"w-full flex items-center justify-between py-2 text-[13px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100 group dark:hover:text-slate-200" + (item.disabled ? " opacity-50 cursor-not-allowed" : "")}>    
                  {item.label}
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 dark:text-slate-600 dark:group-hover:text-slate-400" />
                </button>
              ))}
            </div>
          </section>

          {/* PWA Status */}
          <section className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-[14px] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-200">       
              <Smartphone size={16} /> <span className="font-bold text-[14px]">PWA Status</span>
            </div>

            <div className="space-y-3">
              {[
                { icon: <Globe size={14}/>, label: 'Offline Ready', active: true },
                { icon: <Shield size={14}/>, label: 'Secure (HTTPS)', active: isSecure },
                { icon: <Bell size={14}/>, label: 'Push Enabled', active: settings.pushNotifications },
                { icon: <MapPin size={14}/>, label: 'Location Active', active: settings.locationPermissions },        
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-[13px] font-medium text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-2"><span className="text-indigo-500 dark:text-indigo-400">{item.icon}</span> {item.label}</span>
                  <div className={`w-1.5 h-1.5 rounded-full shadow-sm ${item.active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-300'}`}></div>
                </div>
              ))}
            </div>
          </section>

          {/* Danger Zone */}
          <section className="border border-rose-100 rounded-[14px] p-6 pt-5 bg-white dark:bg-slate-900">
            <h2 className="text-[14px] font-bold text-rose-600 mb-4">Danger Zone</h2>
            <button 
              onClick={handleDeleteAll}
              disabled={isDeletingAll}
              className="w-full h-[42px] flex items-center justify-center bg-white dark:bg-slate-900 border border-rose-200 hover:bg-rose-50 text-rose-600 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-[13px] rounded-xl transition-colors"
            >
              {isDeletingAll ? <Loader2 size={16} className="animate-spin" /> : 'Delete All Reminders'}
            </button>
          </section>
        </div>

      </div>
      ) : (
        <div className="space-y-6">
          <section className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-[14px] p-5">
             <div className="flex items-start gap-4">
               <div className="mt-0.5 text-indigo-500"><Archive size={20} /></div>
               <div>
                 <h3 className="font-bold text-[15px] text-indigo-900 dark:text-indigo-400 mb-1">About the Archive</h3>
                 <p className="text-[13px] text-indigo-700 dark:text-indigo-300">When you delete a reminder it's moved here instead of being permanently removed. You can <strong>restore</strong> any item back to your active list, or <strong>permanently delete</strong> it when you're sure.</p>
               </div>
             </div>
          </section>

          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] overflow-hidden shadow-sm">
             <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><Archive size={18} className="text-slate-600 dark:text-slate-400" /></div>
                 <div>
                   <h2 className="font-bold text-[15px] text-slate-800 dark:text-slate-200">Archived Reminders</h2>
                   <p className="text-[13px] text-slate-500 font-medium">{archivedReminders.length} items stored</p>
                 </div>
               </div>
               <button 
                 onClick={handleBulkDeleteArchive}
                 disabled={isClearingArchives}
                 className="flex items-center gap-2 px-4 py-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-[13px] font-bold transition-colors disabled:opacity-50"
               >
                 {isClearingArchives ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Clear all
               </button>
             </div>

             <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex gap-3">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search archived reminders..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-[14px] outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
                  />
                </div>
                <button onClick={toggleFilter} className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-medium text-[14px]">
                  <Filter size={16} /> Filter
                </button>
             </div>
             {isFilterOpen && (
               <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-500 font-medium">
                 Filter options coming soon...
               </div>
             )}

             <div className="p-5 space-y-4">
               {filteredArchive.length === 0 && (
                 <div className="text-center py-10 text-slate-500 dark:text-slate-400 font-medium border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                   No archived reminders found.
                 </div>
               )}
               {filteredArchive.map((r: any) => (
                 <div key={r.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-xl"></div>
                    <div className="pl-3">
                       <div className="flex items-center gap-3 mb-1.5">
                         <div className={`${getCategoryColorClasses(r.category?.color)} w-8 h-8 rounded-lg flex items-center justify-center`}>
                           {r.category?.icon || '??'}
                         </div>
                         <h3 className="font-bold text-[15px] text-slate-800 dark:text-slate-200">{r.title}</h3>
                       </div>
                       
                       <div className="text-[13px] text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                         <div className="flex items-center gap-1.5"><MapPin size={14}/> {r.location?.name || 'No location'}</div>
                         <div className="flex items-center gap-1.5"><Archive size={14}/> Archived {r.deleted_at ? new Date(r.deleted_at).toLocaleDateString() : 'recently'}</div>
                         {r.due_date && <div className="flex items-center gap-1.5"><Clock size={14}/> {new Date(r.due_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>}
                       </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-3 pl-3 md:pl-0 mt-2 md:mt-0 w-full md:w-auto">
                      <div className="flex gap-2">
                        {r.is_done ? (
                          <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[11px] font-bold">Done</span>
                        ) : (
                          <span className="bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 px-2 py-0.5 rounded-full text-[11px] font-bold">Pending</span>
                        )}
                        {r.category && (
                          <span className={`${getCategoryColorClasses(r.category?.color)} px-2 py-0.5 rounded-full text-[11px] font-bold truncate max-w-[100px]`}>
                            {r.category.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 border-l border-slate-100 dark:border-slate-800 pl-3">
                         <button onClick={() => restoreReminder({id: r.id, is_done: r.is_done})} className="flex shadow-sm items-center gap-1.5 px-3 py-1.5 text-indigo-600 border border-slate-200 dark:border-slate-700 bg-white hover:bg-indigo-50 dark:text-indigo-400 dark:bg-slate-800 dark:hover:bg-indigo-500/10 rounded-lg font-bold text-[12px] transition-colors">
                           <ArchiveRestore size={14} className="opacity-80"/> Restore
                         </button>
                         <button onClick={() => { if(confirm('Permanently delete?')) deleteReminder(r.id); }} className="flex shadow-sm items-center gap-1.5 px-3 py-1.5 text-rose-500 border border-slate-200 dark:border-slate-700 bg-white hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-500/10 rounded-lg font-bold text-[12px] transition-colors">
                           <Trash2 size={14} className="opacity-80"/> Delete
                         </button>
                      </div>
                    </div>
                 </div>
               ))}
             </div>
          </section>
        </div>
      )}
    </div>
  );
}

