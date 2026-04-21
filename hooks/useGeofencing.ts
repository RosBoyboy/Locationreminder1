"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getDistanceInMeters } from "@/lib/haversine";
import { useReminders } from "@/hooks/useReminders";
import { Reminder } from "@/types/models";

export function useGeofencing() {
  const { data: reminders } = useReminders();
  const [currentPosition, setCurrentPosition] = useState<GeolocationPosition | null>(null);
  const [geoStatus, setGeoStatus] = useState<string | null>(null);

  // Alarms that are actively "ringing" / popping up
  const [activeAlarms, setActiveAlarms] = useState<Reminder[]>([]);
  // Keeps track of when an alarm was snoozed (id -> timestamp)
  const [snoozedUntil, setSnoozedUntil] = useState<Record<string, number>>({});

  const notifiedSet = useRef<Set<string>>(new Set());
  const watchIdRef = useRef<number | null>(null);
  const fallbackIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const handleGeoError = useCallback((error: GeolocationPositionError) => {
    let message = "Unable to get your current location.";
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = "Location permission denied. Please allow location access for this app.";
        break;
      case error.POSITION_UNAVAILABLE:
        message = "Location unavailable. Try moving to a more open area.";
        break;
      case error.TIMEOUT:
        message = "Location request timed out. Please try again.";
        break;
    }
    setGeoStatus(message);
    console.warn("Geolocation error:", error);
  }, []);

  const triggerNotification = useCallback((reminder: Reminder) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Location Reminder: " + reminder.title, {
        body: reminder.description || "You arrived at your destination!",
        icon: "/globe.svg", // Using existing icon instead of missing 192x192
      });
    }
    // Also trigger in-app popup
    setActiveAlarms(prev => {
      if (prev.find(a => a.id === reminder.id)) return prev;
      return [...prev, reminder];
    });
  }, []);

  const checkGeofences = useCallback((currentLat: number, currentLon: number, accuracy: number = 0) => {
    if (!reminders) return;

    reminders.forEach((reminder) => {
      // Only check pending/active reminders that have a location
      if (reminder.is_done) {
        return;
      }

      const loc = Array.isArray(reminder.location) ? reminder.location[0] : reminder.location; if (!loc || loc.lat == null || loc.lng == null) return;

      const targetLat = Number(loc.lat);
      const targetLon = Number(loc.lng);
      const radius = Number(loc.radius) || 100;

      const distance = getDistanceInMeters(currentLat, currentLon, targetLat, targetLon);

      console.log(`[Geofence] Checking reminder "` + reminder.title + `": distance = ` + distance.toFixed(1) + `m, radius = ` + radius + `m`);

      // Respect user's selected radius, maybe with a small GPS accuracy margin
      const dynamicTolerance = accuracy > 100 ? (accuracy - 100) : 0; const effectiveRadius = Math.max(radius, radius + dynamicTolerance, 50);

      if (distance <= effectiveRadius) {
        const now = Date.now();
        const snoozeExpiry = snoozedUntil[reminder.id] || 0;

        if (!notifiedSet.current.has(reminder.id)) {
          if (now >= snoozeExpiry) {
            triggerNotification(reminder);
            notifiedSet.current.add(reminder.id);
          }
        }
      } else {
        if (notifiedSet.current.has(reminder.id)) {
          notifiedSet.current.delete(reminder.id);
        }
      }
    });
  }, [reminders, snoozedUntil, triggerNotification]);

  // Immediately re-check if new reminders are added while you are standing still
  useEffect(() => {
    if (currentPosition) {
      checkGeofences(currentPosition.coords.latitude, currentPosition.coords.longitude, currentPosition.coords.accuracy);
    }
  }, [reminders, currentPosition, checkGeofences]);

  // Main Geolocation loop
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGeoStatus("Geolocation is not supported by your browser.");
      return;
    }

    setGeoStatus(null);

    const handlePosition = (position: GeolocationPosition) => {
      setGeoStatus(null);
      setCurrentPosition(position);
      checkGeofences(position.coords.latitude, position.coords.longitude, position.coords.accuracy);
    };

    navigator.geolocation.getCurrentPosition(
      handlePosition,
      handleGeoError,
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
    );

    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePosition,
      handleGeoError,
      { enableHighAccuracy: true, maximumAge: 15000, timeout: 30000 }
    );

    fallbackIntervalRef.current = window.setInterval(() => {
      navigator.geolocation.getCurrentPosition(handlePosition, handleGeoError, {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 20000,
      });
    }, 15000);

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (fallbackIntervalRef.current !== null) {
        clearInterval(fallbackIntervalRef.current);
      }
    };
  }, [checkGeofences, handleGeoError]);

  const snoozeAlarm = useCallback((reminderId: string, minutes: number = 15) => {
    setSnoozedUntil(prev => ({
      ...prev,
      [reminderId]: Date.now() + minutes * 60 * 1000
    }));
    setActiveAlarms(prev => prev.filter(r => r.id !== reminderId));
    notifiedSet.current.delete(reminderId);
  }, []);

  const dismissAlarm = useCallback((reminderId: string) => {
    setActiveAlarms(prev => prev.filter(r => r.id !== reminderId));
  }, []);

  return { currentPosition, activeAlarms, snoozeAlarm, dismissAlarm, geoStatus };
}

