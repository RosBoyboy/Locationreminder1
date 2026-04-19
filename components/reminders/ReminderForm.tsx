"use client";

import { useState } from "react";
import { createReminderAction } from "@/lib/actions";
import { MapPin, Navigation, Edit3, Type, Info, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface ReminderFormProps {
  selectedLocation: { lat: number; lng: number } | null;
  onClearLocation: () => void;
}

export function ReminderForm({ selectedLocation, onClearLocation }: ReminderFormProps) {
  const [radius, setRadius] = useState(100);
  const [title, setTitle] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedLocation) {
        setErrorMsg("Please select a location on the map first.");
        return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append("radius", radius.toString());

    try {
      setIsPending(true);
      setErrorMsg("");
      await createReminderAction(selectedLocation.lat, selectedLocation.lng, formData);
      onClearLocation();
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while saving.");
    } finally {
      setIsPending(false);
    }
  };

  if (!selectedLocation) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
        <MapPin size={24} className="mb-2 text-slate-300" />
        <p className="font-medium text-sm">Select a location on the map</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full pt-2 bg-gradient-to-b from-white to-slate-50/20 dark:from-slate-900 dark:to-slate-800/20">
      <div className="mb-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0 border border-indigo-100 text-indigo-500 dark:text-indigo-400 shadow-sm">
          <Edit3 size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 tracking-tight">New Trigger</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md inline-flex border border-slate-200 dark:border-slate-800/60">
            <span className="text-indigo-400">●</span> {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
          </p>
        </div>
      </div>

      <div className="space-y-6 flex-1">
        {/* Title Input */}
        <div className="space-y-2 relative group">
          <label htmlFor="title" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1.5">
            <Type size={12} className="text-indigo-400"/>
            Task Title
          </label>
          <input
            id="title"
            name="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="E.g., Pick up dry cleaning"
            required
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>

        {/* Description Input */}
        <div className="space-y-2 relative">
          <label htmlFor="description" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1.5">
            <Info size={12} className="text-amber-400"/>
            Details (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Remember to ask for the receipt..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[100px] resize-y shadow-sm"
          />
        </div>

        {/* Radius Slider */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1.5">
              <Navigation size={12} className="text-emerald-400" />
              Trigger Radius
            </label>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/20 px-2 py-1 rounded-md shadow-sm border border-indigo-100/50">
              {radius} meters
            </span>
          </div>

          <div className="relative pt-2">
            <input
              type="range"
              min={10}
              max={1000}
              step={10}
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none outline-none accent-indigo-600"
            />
             {/* Note: The accent color handles standard browsers, styling customized ranges needs more work, but this looks decent natively */}
          </div>
          <p className="text-[11px] text-slate-400">
            Your device will alert you as soon as you enter this zone. Smaller ranges use more accurate GPS.
          </p>
        </div>

        {errorMsg && (
          <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-medium">
            {errorMsg}
          </motion.div>
        )}
      </div>

      <div className="flex gap-3 pt-6 mt-8 border-t border-slate-100 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={onClearLocation}
          className="flex-1 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 hover:dark:bg-slate-800 hover:text-slate-800 hover:dark:text-slate-200 transition-all shadow-sm"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isPending || !title}
          className="flex-1 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
             <>
               <CheckCircle2 size={18} />
               Save Trigger
             </>
          )}
        </button>
      </div>
    </form>
  );
}

