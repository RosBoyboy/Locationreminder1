import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Navigation, Tag } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useCreateReminderWithLocation } from '@/hooks/useReminders';
import dynamic from 'next/dynamic';

const MapSelector = dynamic(() => import('./MapSelector'), { 
  ssr: false,
  loading: () => <div className="h-[260px] bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse flex items-center justify-center text-slate-400 font-medium">Loading Map...</div>
});

interface CreateReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateReminderModal({ isOpen, onClose }: CreateReminderModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [address, setAddress] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [radius, setRadius] = useState(100);
  const [selectedMapPin, setSelectedMapPin] = useState<{lat: number, lng: number, x: number, y: number} | null>(null);
  
  const { data: categories } = useCategories();
  const { mutate: createReminder, isPending } = useCreateReminderWithLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedMapPin) return;

    createReminder({
      reminderData: {
        title,
        description,
        category_id: categoryId || null,
        due_date: null,
        status: 'Pending',
        is_done: false
      },
      locationData: {
        name: locationName.trim() || 'Custom Location',
        address: address.trim() || undefined,
        lat: selectedMapPin.lat,
        lng: selectedMapPin.lng,
        radius: radius
      }
    }, {
      onSuccess: () => {
        setTitle('');
        setDescription('');
        setLocationName('');
        setAddress('');
        setCategoryId('');
        setSelectedMapPin(null);
        setRadius(100);
        onClose();
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">New Location Reminder</h2>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <input 
                    type="text"
                    placeholder="What do you need to do?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-0 py-2 border-0 border-b-2 border-slate-100 dark:border-slate-800 focus:ring-0 focus:border-indigo-500 text-lg font-semibold placeholder:font-medium placeholder:text-slate-300 transition-colors bg-transparent"
                  />
                </div>
                <div>
                  <textarea 
                    placeholder="Add details or notes..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all resize-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 dark:text-slate-300">
                  <MapPin size={16} className="text-indigo-500 dark:text-indigo-400" /> Set Location Trigger
                </label>
                <div className="flex gap-3 mb-3">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="Location Name (e.g. Home)" 
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
                    />
                  </div>
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="Optional Address" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
                    />
                  </div>
                </div>
                <MapSelector
                  radius={radius}
                  selectedPin={selectedMapPin}
                  onSelectPin={(lat, lng) => setSelectedMapPin({ lat, lng, x: 0, y: 0 })}
                  onLocationDetails={(name, addr) => {
                    setLocationName(name);
                    setAddress(addr);
                  }}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Geofence Radius</label>
                  <span className="text-[13px] font-bold text-indigo-600 dark:text-indigo-400">{radius}m</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                  <span>50m</span>
                  <span>250m</span>
                  <span>500m</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories?.map(cat => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategoryId(cat.id)}
                      className={'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ' + (categoryId === cat.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800')}
                    >
                      <span>{cat.icon}</span> {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!title || !selectedMapPin || isPending}
                  className="w-full flex items-center justify-center py-3 px-4 bg-indigo-600 text-white rounded-xl font-bold text-[14px] hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? 'Creating...' : 'Create Location Reminder'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
