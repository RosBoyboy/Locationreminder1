"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { getDistanceInMeters } from "@/lib/haversine";

export type Reminder = {
  id: string;
  title: string;
  description: string;
  radius_meters: number;
  location: any;
};

export function useGeofencing() {
  const [currentPosition, setCurrentPosition] = useState<GeolocationPosition | null>(null);
  const [activeReminders, setActiveReminders] = useState<Reminder[]>([]);
  const notifiedReminders = useRef<Set<string>>(new Set());
  const supabase = createClient();

  useEffect(() => {
    const fetchReminders = async () => {
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("is_active", true);
        
      if (!error && data) setActiveReminders(data);
    };
    fetchReminders();
    
    const channel = supabase
      .channel("geofence-sync")
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

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const triggerNotification = useCallback((reminder: Reminder) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(reminder.title, {
        body: reminder.description || "You arrived at your destination!",
        icon: "/icon-192x192.png", 
      });
    }
  }, []);

  const checkGeofences = useCallback((currentLat: number, currentLon: number) => {
    activeReminders.forEach((reminder) => {
      // Supabase's postGIS outputs location naturally as GeoJSON in PostgREST
      if (!reminder.location || !reminder.location.coordinates) return;
      
      const [targetLon, targetLat] = reminder.location.coordinates;
      const distance = getDistanceInMeters(currentLat, currentLon, targetLat, targetLon);

      if (distance <= reminder.radius_meters) {
        if (!notifiedReminders.current.has(reminder.id)) {
          triggerNotification(reminder);
          notifiedReminders.current.add(reminder.id);
        }
      } else {
        if (notifiedReminders.current.has(reminder.id)) {
          notifiedReminders.current.delete(reminder.id);
        }
      }
    });
  }, [activeReminders, triggerNotification]);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.error("Geolocation is not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentPosition(position);
        checkGeofences(position.coords.latitude, position.coords.longitude);
      },
      (error) => console.error("Geolocation error:", error),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [checkGeofences]);

  return { currentPosition, activeReminders };
}