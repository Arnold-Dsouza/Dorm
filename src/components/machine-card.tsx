
"use client";

import { useState, useEffect, useCallback } from 'react';
import { WashingMachine, Wind, Timer, User, Info, Flag, AlertTriangle, ShieldAlert, FileWarning, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Machine, Report } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { WaterAnimation } from './water-animation';


interface MachineCardProps {
  machine: Machine;
  currentUser: string;
  onStart: (machineId: string, durationMinutes: number) => void;
  onFinish: (machineId: string) => void;
  onReport: (machineId: string, issue: string) => void;
  onWarning: (machineId: string, message: string) => void;
  onResolveReport: (machineId: string, reportId: string) => void;
  onResolveWarning: (machineId: string, warningId: string) => void;
  canStartNewMachine: boolean;
}

const formatTime = (totalSeconds: number) => {
  if (totalSeconds <= 0) return '00:00:00';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default function MachineCard({ machine, currentUser, onStart, onFinish, onReport, onWarning, onResolveReport, onResolveWarning, canStartNewMachine }: MachineCardProps) {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [durationHours, setDurationHours] = useState('0');
  const [durationMinutes, setDurationMinutes] = useState('45');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [reportValue, setReportValue] = useState("");
  const [warningSelection, setWarningSelection] = useState("");
  const [otherWarningValue, setOtherWarningValue] = useState("");

  const { toast } = useToast();

  const hasUserReported = machine.reports.some(r => r.userId === currentUser);
  const hasUserWarned = machine.warnings.some(w => w.userId === currentUser);
  const isOutOfOrder = machine.status === 'out-of-order';
  const isInUse = machine.status === 'in-use';

  const onFinishStable = useCallback(onFinish, [onFinish]);

  useEffect(() => {
    if (machine.status !== 'in-use' || !machine.timerEnd) {
      setRemainingSeconds(0);
      return;
    }
  
    const calculateRemaining = () => {
      return Math.round((machine.timerEnd! - Date.now()) / 1000);
    };
  
    setRemainingSeconds(calculateRemaining());
  
    const intervalId = setInterval(() => {
      const secondsLeft = calculateRemaining();
      if (secondsLeft > 0) {
        setRemainingSeconds(secondsLeft);
      } else {
        setRemainingSeconds(0);
        if (machine.status === 'in-use') { // Prevent multiple calls
            onFinishStable(machine.id);
        }
        clearInterval(intervalId);
      }
    }, 1000);
  
    return () => clearInterval(intervalId);
  }, [machine.status, machine.timerEnd, machine.id, onFinishStable]);

  const handleStartClick = () => {
    const hours = parseInt(durationHours, 10) || 0;
    const minutes = parseInt(durationMinutes, 10) || 0;
    const totalDurationMinutes = (hours * 60) + minutes;

    if (totalDurationMinutes > 0) {
      onStart(machine.id, totalDurationMinutes);
      setIsDialogOpen(false);
    }
  };

  const handleStopClick = () => {
    onFinish(machine.id);
  };
  
  const handleReportSubmit = () => {
    if (!reportValue || hasUserReported) return;
    onReport(machine.id, reportValue);
    toast({
      title: "Report Submitted",
      description: `Your report for "${reportValue}" has been sent.`,
    });
    setReportValue("");
    setIsPopoverOpen(false);
  };

  const handleWarningSubmit = () => {
    const finalWarning = warningSelection === 'other' ? otherWarningValue : warningSelection;
    if (!finalWarning || hasUserWarned) return;
    onWarning(machine.id, finalWarning);
     toast({
      title: "Warning Submitted",
      description: `Your warning has been sent.`,
    });
    setWarningSelection("");
    setOtherWarningValue("");
    setIsPopoverOpen(false);
  };
  const hasFiveSameReports = (reports: Report[]): boolean => {
    if (reports.length < 2) {
      return false;
    }
    const issueCounts = reports.reduce((acc: { [key: string]: number }, report) => {
      acc[report.issue] = (acc[report.issue] || 0) + 1;
      return acc;
    }, {});
    return Object.values(issueCounts).some(count => count >= 2);
  };

  const showReportIconInCircle = hasFiveSameReports(machine.reports);

  const isAvailable = machine.status === 'available';
  const isUserMachine = machine.status === 'in-use' && machine.apartmentUser === currentUser;
  const MachineIcon = machine.type === 'washer' ? WashingMachine : Wind;
  
  const getCardColor = () => {
    if (isOutOfOrder) return { border: 'border-red-700', bg: 'bg-red-700/10', icon: 'text-red-700' };
    if (isAvailable) return { border: 'border-green-500', bg: 'bg-green-500/10', icon: 'text-green-500' };
    return { border: 'border-orange-500', bg: 'bg-orange-500/10', icon: 'text-orange-500' };
  };

  const { border: cardColor, bg: cardBgColor, icon: iconColor } = getCardColor();


  return (
    <div className={cn(
      "relative flex flex-col justify-between w-full mx-auto bg-card rounded-xl shadow-md transition-all hover:shadow-lg p-3 sm:p-4 space-y-3 sm:space-y-4 border",
    )}>
       <div className={cn("absolute top-0 left-0 w-full h-2 rounded-t-xl", isAvailable ? "bg-green-500" : isOutOfOrder ? "bg-red-700" : "bg-orange-500")}></div>
       <div className="flex justify-between items-start pt-2">
        <h3 className="font-bold text-lg font-headline">{machine.name}</h3>
        <div className="flex items-center gap-2">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Info className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="info">
                      <Info className="h-4 w-4 mr-2" />
                      Info
                    </TabsTrigger>
                    <TabsTrigger value="report" className="data-[state=active]:bg-red-500 data-[state=active]:text-white" disabled={hasUserReported || isOutOfOrder}>
                      <Flag className="h-4 w-4 mr-2" />
                      Report
                    </TabsTrigger>
                    <TabsTrigger value="warning" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black" disabled={hasUserWarned || isOutOfOrder}>
                      <AlertTriangle className="h-4 w-4 mr-2 text-yellow-700 data-[state=active]:text-black" />
                      Warning
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="info">
                     <ScrollArea className="h-48 w-full py-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center"><FileWarning className="h-4 w-4 mr-2 text-red-500" /> Reports ({machine.reports.length})</h4>
                            {machine.reports.length > 0 ? (
                              <ul className="space-y-2 text-xs text-muted-foreground">
                                {machine.reports.map((report) => (
                                  <li key={report.id} className="flex justify-between items-center">
                                    <span>"{report.issue}" by {report.userId}</span>
                                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => onResolveReport(machine.id, report.id)}>
                                      <CheckCircle className="h-3 w-3 mr-1" /> Solved
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            ) : (<p className="text-xs text-muted-foreground">No reports for this machine.</p>)}
                          </div>
                          <Separator />
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center"><AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" /> Warnings ({machine.warnings.length})</h4>
                            {machine.warnings.length > 0 ? (
                               <ul className="space-y-2 text-xs text-muted-foreground">
                                {machine.warnings.map((warning) => (
                                  <li key={warning.id} className="flex justify-between items-center">
                                    <span>"{warning.message}" by {warning.userId}</span>
                                     <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => onResolveWarning(machine.id, warning.id)}>
                                       <CheckCircle className="h-3 w-3 mr-1" /> Solved
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            ) : (<p className="text-xs text-muted-foreground">No warnings for this machine.</p>)}
                          </div>
                        </div>
                     </ScrollArea>
                  </TabsContent>
                  <TabsContent value="report">
                     <div className="py-4 space-y-4">
                        <Label>Select an issue to report:</Label>
                        <RadioGroup value={reportValue} onValueChange={setReportValue}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Machine not working" id={`${machine.id}-r1`} />
                            <Label htmlFor={`${machine.id}-r1`}>Machine not working</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Machine not draining" id={`${machine.id}-r2`} />
                            <Label htmlFor={`${machine.id}-r2`}>Machine not draining</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Cycle not starting" id={`${machine.id}-r3`} />
                            <Label htmlFor={`${machine.id}-r3`}>Cycle not starting</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Water not filling" id={`${machine.id}-r4`} />
                            <Label htmlFor={`${machine.id}-r4`}>Water not filling</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Excessive noise/vibration" id={`${machine.id}-r5`} />
                            <Label htmlFor={`${machine.id}-r5`}>Excessive noise/vibration</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Door won't open/close" id={`${machine.id}-r6`} />
                            <Label htmlFor={`${machine.id}-r6`}>Door won't open/close</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Display/controls not working" id={`${machine.id}-r7`} />
                            <Label htmlFor={`${machine.id}-r7`}>Display/controls not working</Label>
                          </div>
                        </RadioGroup>
                        <Button className="w-full" onClick={handleReportSubmit} disabled={!reportValue || hasUserReported}>{hasUserReported ? "Already Reported" : "Submit Report"}</Button>
                     </div>
                  </TabsContent>
                  <TabsContent value="warning">
                    <div className="py-4 space-y-4">
                        <Label>Select a warning:</Label>
                        <RadioGroup value={warningSelection} onValueChange={setWarningSelection}>
                           <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Machine is smelling" id={`${machine.id}-w1`} />
                            <Label htmlFor={`${machine.id}-w1`}>Machine is smelling</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Machine not clean" id={`${machine.id}-w2`} />
                            <Label htmlFor={`${machine.id}-w2`}>Machine not clean</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Lint buildup" id={`${machine.id}-w3`} />
                            <Label htmlFor={`${machine.id}-w3`}>Lint buildup</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Soap residue remaining" id={`${machine.id}-w4`} />
                            <Label htmlFor={`${machine.id}-w4`}>Soap residue remaining</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Water spots/stains" id={`${machine.id}-w5`} />
                            <Label htmlFor={`${machine.id}-w5`}>Water spots/stains</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Door seal needs cleaning" id={`${machine.id}-w6`} />
                            <Label htmlFor={`${machine.id}-w6`}>Door seal needs cleaning</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id={`${machine.id}-w7`} />
                            <Label htmlFor={`${machine.id}-w7`}>Other</Label>
                          </div>
                        </RadioGroup>
                        {warningSelection === 'other' && (
                           <Textarea 
                            id="warning-text-other"
                            placeholder="Please describe the warning..."
                            value={otherWarningValue}
                            onChange={(e) => setOtherWarningValue(e.target.value)}
                          />
                        )}
                         <Button 
                            className="w-full" 
                            onClick={handleWarningSubmit} 
                            disabled={hasUserWarned || !warningSelection || (warningSelection === 'other' && !otherWarningValue)}>
                              {hasUserWarned ? "Already Warned" : "Submit Warning" }
                          </Button>
                    </div>
                  </TabsContent>
                </Tabs>
            </PopoverContent>
          </Popover>
          <MachineIcon className={cn("h-6 w-6", iconColor)} />
        </div>
      </div>

      <div className={cn(
          "relative flex items-center justify-center aspect-square w-full max-w-[150px] sm:max-w-[224px] mx-auto rounded-full border-8 shadow-inner bg-background overflow-hidden",
          cardColor
      )}>
        {isInUse && <WaterAnimation />}
        <div className={cn(
          "relative flex items-center justify-center w-[95%] h-[95%] rounded-full backdrop-blur-sm border-4 border-card",
           cardBgColor
        )}>
          {(showReportIconInCircle || machine.warnings.length > 0) && !isOutOfOrder && (
              <div className="absolute top-3 sm:top-5 flex items-center gap-2 z-10">
                  {showReportIconInCircle && (
                      <FileWarning className="h-5 w-5 text-red-500 animate-blink" />
                  )}
                  {machine.warnings.length > 0 && (
                      <AlertTriangle className="h-5 w-5 text-yellow-500 animate-blink" />
                  )}
              </div>
          )}

          {isOutOfOrder ? (
              <div className="text-center text-red-700">
                <ShieldAlert className="h-12 w-12 mx-auto animate-pulse" />
                <span className="text-lg font-bold tracking-wider mt-1">Out of Order</span>
              </div>
          ) : isAvailable ? (
             <div className="flex flex-col items-center justify-center text-center h-full">
              <span className="text-xl sm:text-2xl font-bold text-green-600 tracking-wider">Available</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-foreground h-full pt-1">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold font-headline tabular-nums flex items-center justify-center gap-1">
                <Timer className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                {formatTime(remainingSeconds)}
              </div>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 mt-2">
                <User className="h-3 w-3" />
                {machine.apartmentUser}
              </p>
            </div>
          )}
        </div>
      </div>

      {isUserMachine ? (
        <Button className="w-full" variant="destructive" onClick={handleStopClick}>
          Stop Cycle
        </Button>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" disabled={!isAvailable || !canStartNewMachine || isOutOfOrder}>
               {isOutOfOrder ? 'Out of Order' : 'Start Cycle'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Start {machine.name}</DialogTitle>
              <DialogDescription>
                Set the cycle duration. The machine will be marked as in-use.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 items-center gap-4">
                  <div>
                    <Label htmlFor="hours" className="text-right">
                      Hours
                    </Label>
                    <Input
                      id="hours"
                      type="number"
                      value={durationHours}
                      onChange={(e) => setDurationHours(e.target.value)}
                      className="w-full"
                      placeholder="e.g., 1"
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minutes" className="text-right">
                      Minutes
                    </Label>
                    <Input
                      id="minutes"
                      type="number"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(e.target.value)}
                      className="w-full"
                      placeholder="e.g., 30"
                      min="0"
                      max="59"
                    />
                  </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" onClick={handleStartClick}>Start</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
