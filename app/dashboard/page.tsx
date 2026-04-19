"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardClient from '@/components/DashboardClient';
import { authService } from '@/services/authService';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (!isMounted) return;
        
        if (!user) {
          router.push('/login');
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        if (isMounted) {
          router.push('/login');
        }
      }
    };
    checkAuth();
    return () => { isMounted = false; };
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  return <DashboardClient />;
}