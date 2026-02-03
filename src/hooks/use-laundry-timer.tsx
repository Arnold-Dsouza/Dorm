import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface LaundryTimer {
  id: string;
  machineId?: string;
  machineNumber: number;
  machineType: 'washer' | 'dryer';
  machineName: string;
  endTime: number;
  duration: number;
  cycleType: 'wash' | 'dry';
}

export function useLaundryTimer() {
  const [timers, setTimers] = useState<LaundryTimer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const { toast } = useToast();
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if we're in a mobile environment (for PWA, we'll just check if it's a mobile browser)
  const isMobile = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Check notification permission status on mount
  useEffect(() => {
    if ('Notification' in window) {
      setIsNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  // Load timers from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('laundry-timers');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTimers(parsed);
      } catch (error) {
        console.error('Failed to parse stored timers:', error);
      }
    }
  }, []);

  // Save timers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('laundry-timers', JSON.stringify(timers));
  }, [timers]);

  // Check for completed timers
  useEffect(() => {
    const checkTimers = () => {
      const now = Date.now();
      setTimers(prev => {
        const updated = prev.filter(timer => {
          if (now >= timer.endTime) {
            // Show notification when timer completes
            toast({
              title: "Laundry Ready! 🎉",
              description: `${timer.machineName} has finished`,
              duration: 10000,
            });
            
            // Try browser notification if permission granted
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Laundry Ready!', {
                body: `${timer.machineName} has finished`,
                icon: '/tabu.png',
                badge: '/tabu.png',
              });
            }
            
            return false; // Remove timer
          }
          return true; // Keep timer
        });
        return updated;
      });
    };

    // Check every second
    checkIntervalRef.current = setInterval(checkTimers, 1000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [toast]);

  const startLaundryCycle = useCallback(async (
    machineNumber: number,
    cycleType: 'wash' | 'dry',
    duration: number
  ): Promise<string> => {
    setIsLoading(true);

    try {
      const now = Date.now();
      const endTime = now + (duration * 60 * 1000); // duration is in minutes
      
      const newTimer: LaundryTimer = {
        id: `timer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        machineNumber,
        machineType: cycleType === 'wash' ? 'washer' : 'dryer',
        machineName: `Machine ${machineNumber}`,
        cycleType,
        endTime,
        duration,
      };

      setTimers(prev => [...prev, newTimer]);

      toast({
        title: "Timer Started",
        description: `Timer set for ${duration} minutes`,
      });

      // Request notification permission if not already granted
      if ('Notification' in window && Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        setIsNotificationsEnabled(permission === 'granted');
      }

      return newTimer.id;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const cancelTimer = useCallback(async (timerId: string) => {
    setTimers(prev => prev.filter(t => t.id !== timerId));
    toast({
      title: "Timer Cancelled",
      description: "Your laundry timer has been cancelled",
    });
  }, [toast]);

  const requestNotificationPermissions = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setIsNotificationsEnabled(permission === 'granted');
      
      if (permission === 'granted') {
        toast({
          title: "Notifications Enabled",
          description: "You'll be notified when your laundry is ready",
        });
      } else {
        toast({
          title: "Notifications Denied",
          description: "Please enable notifications in your browser settings",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const getFormattedRemainingTime = useCallback((timerId: string): string => {
    const timer = timers.find(t => t.id === timerId);
    if (!timer) return '0:00';

    const now = Date.now();
    const remaining = Math.max(0, timer.endTime - now);
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [timers]);

  const clearAllTimers = useCallback(() => {
    setTimers([]);
    localStorage.removeItem('laundry-timers');
  }, []);

  return {
    timers,
    activeTimers: timers, // Alias for backward compatibility
    isLoading,
    isMobile,
    isNotificationsEnabled,
    startLaundryCycle,
    cancelTimer,
    requestNotificationPermissions,
    getFormattedRemainingTime,
    clearAllTimers,
  };
}
