"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isReminderModalOpen: boolean;
  setIsReminderModalOpen: (isOpen: boolean) => void;
  showMockNotifications: boolean;
  setShowMockNotifications: (show: boolean) => void;
  expandedAlarmId: string | null;
  setExpandedAlarmId: (id: string | null) => void;
  mapCenterFocus: [number, number] | null;
  setMapCenterFocus: (center: [number, number] | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);        

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);        
  const [showMockNotifications, setShowMockNotifications] = useState(true);     
  const [expandedAlarmId, setExpandedAlarmId] = useState<string | null>(null);  
  const [mapCenterFocus, setMapCenterFocus] = useState<[number, number] | null>(null);

  React.useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) setTab(savedTab);
  }, []);

  const setActiveTab = (tab: string) => {
    setTab(tab);
    localStorage.setItem("activeTab", tab);
  };

  return (
    <AppContext.Provider value={{
      activeTab, setActiveTab,
      isSidebarOpen, setIsSidebarOpen,
      isReminderModalOpen, setIsReminderModalOpen,
      showMockNotifications, setShowMockNotifications,
      expandedAlarmId, setExpandedAlarmId,
      mapCenterFocus, setMapCenterFocus
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
