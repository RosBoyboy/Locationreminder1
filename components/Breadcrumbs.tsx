"use client";
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function Breadcrumbs() {
  const { activeTab, setActiveTab } = useAppContext();

  const getBreadcrumbPath = () => {
    switch (activeTab) {
      case 'dashboard': return [{ label: 'Dashboard', id: 'dashboard' }];
      case 'reminders': return [{ label: 'Reminders', id: 'reminders' }];
      case 'map': return [{ label: 'Map', id: 'map' }];
      case 'categories': return [{ label: 'Categories', id: 'categories' }];
      case 'settings': return [{ label: 'Settings', id: 'settings' }];
      case 'account': return [{ label: 'Settings', id: 'settings' }, { label: 'Account', id: 'account' }];
      default: return [{ label: activeTab.charAt(0).toUpperCase() + activeTab.slice(1), id: activeTab }];
    }
  };

  const path = getBreadcrumbPath();

  return (
    <nav className="flex items-center space-x-1 text-sm font-medium text-slate-500 mb-3 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl w-max border border-slate-100 dark:border-slate-800">
      <button 
        onClick={() => setActiveTab('dashboard')}
        className="flex items-center hover:text-indigo-600 transition-colors"
      >
        <Home size={14} className="mr-1.5" />
        Home
      </button>
      
      {path.map((item, index) => {
        const isLast = index === path.length - 1;
        return (
          <React.Fragment key={item.id}>
            <ChevronRight size={14} className="text-slate-400 mx-1" />
            <button
              onClick={() => setActiveTab(item.id)}
              className={`${
                isLast 
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold cursor-default flex items-center bg-indigo-500/20 px-2 py-0.5 rounded-md' 
                  : 'hover:text-indigo-600 transition-colors'
              }`}
              disabled={isLast}
            >
              {item.label}
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );
}