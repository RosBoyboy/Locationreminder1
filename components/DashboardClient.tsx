"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useAppContext } from '@/context/AppContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import DashboardPage from '@/views/DashboardPage';
import RemindersPage from '@/views/RemindersPage';
import MapPage from '@/views/MapPage';
import CategoriesPage from '@/views/CategoriesPage';
import SettingsPage from '@/views/SettingsPage';
import AccountPage from '@/views/AccountPage';
import CreateReminderModal from '@/components/reminders/CreateReminderModal';   
import ActiveReminderModal from '@/components/reminders/ActiveReminderModal';   
import Breadcrumbs from '@/components/Breadcrumbs';
import { useGeofencing } from '@/hooks/useGeofencing';

function DashboardContent() {
  const { activeTab, isSidebarOpen, setIsSidebarOpen, isReminderModalOpen, setIsReminderModalOpen } = useAppContext();
  const { activeAlarms, snoozeAlarm, dismissAlarm, geoStatus } = useGeofencing();

  return (
    <div className="flex h-screen bg-[#fcfcff] dark:bg-slate-950 overflow-hidden font-sans text-slate-800 dark:text-slate-200">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 relative h-screen overflow-hidden">
        <Topbar activeAlarms={activeAlarms} dismissAlarm={dismissAlarm} />

        {geoStatus && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 text-sm text-center">
            {geoStatus}
          </div>
        )}

        {activeTab !== "map" && (
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-10 pb-32">
            <Breadcrumbs />
            {
              activeTab === "dashboard" ? <DashboardPage /> :
              activeTab === "reminders" ? <RemindersPage /> :
              activeTab === "categories" ? <CategoriesPage /> :
              activeTab === "settings" ? <SettingsPage /> :
              activeTab === "account" ? <AccountPage /> : null
            }
          </div>
        )}

        {activeTab === "map" && <MapPage />}

        {isReminderModalOpen && (
           <CreateReminderModal 
             isOpen={isReminderModalOpen} 
             onClose={() => setIsReminderModalOpen(false)} 
           />
        )}
        {/* The Alarm/Popping modal for reached locations */} 
        <ActiveReminderModal
          activeAlarms={activeAlarms}
          snoozeAlarm={snoozeAlarm}
          dismissAlarm={dismissAlarm}
        />
      </main>
    </div>
  );
}

export default function DashboardClient() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}
