'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLaundryTimer } from '@/hooks/use-laundry-timer';
import { Clock, Play, Square, Bell, BellOff } from 'lucide-react';

interface LaundryTimerWidgetProps {
  machineNumber: number;
  onTimerStart?: (timerId: string) => void;
  onTimerComplete?: (timerId: string) => void;
}

export function LaundryTimerWidget({ 
  machineNumber, 
  onTimerStart, 
  onTimerComplete 
}: LaundryTimerWidgetProps) {
  const [selectedCycle, setSelectedCycle] = useState<'wash' | 'dry'>('wash');
  const [duration, setDuration] = useState(30);
  
  const {
    activeTimers,
    isNotificationsEnabled,
    isLoading,
    isMobile,
    startLaundryCycle,
    cancelTimer,
    requestNotificationPermissions,
    getFormattedRemainingTime,
  } = useLaundryTimer();

  // Find timer for this machine
  const machineTimer = activeTimers.find(timer => timer.machineNumber === machineNumber);

  const handleStartTimer = async () => {
    const timerId = await startLaundryCycle(machineNumber, selectedCycle, duration);
    if (timerId && onTimerStart) {
      onTimerStart(timerId);
    }
  };

  const handleStopTimer = async () => {
    if (machineTimer) {
      await cancelTimer(machineTimer.id);
      if (onTimerComplete) {
        onTimerComplete(machineTimer.id);
      }
    }
  };

  const cycleOptions = [
    { value: 'wash', label: 'Wash', durations: [30, 45, 60, 90] },
    { value: 'dry', label: 'Dry', durations: [30, 45, 60, 75, 90] }
  ];

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Machine {machineNumber}</CardTitle>
          <div className="flex items-center gap-2">
            {!isMobile && (
              <Badge variant="outline" className="text-xs">
                Web Only
              </Badge>
            )}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={requestNotificationPermissions}
                className="p-1"
              >
                {isNotificationsEnabled ? (
                  <Bell className="h-4 w-4 text-green-600" />
                ) : (
                  <BellOff className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {machineTimer ? (
          // Timer is running
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-lg font-semibold">
              <Clock className="h-5 w-5 text-blue-600" />
              {getFormattedRemainingTime(machineTimer.id)}
            </div>
            
            <Badge variant="secondary" className="text-sm">
              {machineTimer.cycleType === 'wash' ? 'Washing' : 'Drying'} in progress
            </Badge>
            
            <Button 
              variant="destructive" 
              onClick={handleStopTimer}
              className="w-full"
              size="sm"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop Timer
            </Button>
            
            {isMobile && isNotificationsEnabled && (
              <p className="text-xs text-muted-foreground">
                📱 You'll get notified when the cycle is complete
              </p>
            )}
          </div>
        ) : (
          // No timer running
          <div className="space-y-4">
            {/* Cycle Type Selection */}
            <div className="flex gap-2">
              {cycleOptions.map((cycle) => (
                <Button
                  key={cycle.value}
                  variant={selectedCycle === cycle.value ? "default" : "outline"}
                  onClick={() => setSelectedCycle(cycle.value as 'wash' | 'dry')}
                  className="flex-1"
                  size="sm"
                >
                  {cycle.label}
                </Button>
              ))}
            </div>

            {/* Duration Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration (minutes)</label>
              <div className="grid grid-cols-2 gap-2">
                {cycleOptions
                  .find(c => c.value === selectedCycle)
                  ?.durations.map((mins) => (
                    <Button
                      key={mins}
                      variant={duration === mins ? "default" : "outline"}
                      onClick={() => setDuration(mins)}
                      size="sm"
                      className="text-xs"
                    >
                      {mins}m
                    </Button>
                  ))}
              </div>
            </div>

            {/* Start Button */}
            <Button 
              onClick={handleStartTimer}
              disabled={isLoading}
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              Start {selectedCycle === 'wash' ? 'Washing' : 'Drying'} ({duration}m)
            </Button>
            
            {/* Notification Status */}
            {isMobile && !isNotificationsEnabled && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  💡 Enable notifications to get alerts when your laundry is done!
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={requestNotificationPermissions}
                  className="w-full mt-2 text-xs"
                >
                  Enable Notifications
                </Button>
              </div>
            )}
            
            {!isMobile && (
              <p className="text-xs text-muted-foreground text-center">
                📱 Timer notifications only work on mobile devices
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
