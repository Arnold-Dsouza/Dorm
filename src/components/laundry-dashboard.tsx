
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Building, Machine } from '@/lib/types';
import MachineCard from './machine-card';
import { useToast } from "@/hooks/use-toast";
import { db } from '@/lib/firebase';
import { collection, doc, writeBatch, onSnapshot, runTransaction, Timestamp, getDocs } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { getDormConfig } from '@/dorms/registry';
import { useLaundryTimer } from '@/hooks/use-laundry-timer';
import { Bell, BellOff, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ErrorsDialog from './errors-dialog';

interface LaundryDashboardProps {
  selectedBuildingId: string;
  currentUser: string;
}

export default function LaundryDashboard({ selectedBuildingId, currentUser }: LaundryDashboardProps) {
  const [dorm, setDorm] = useState<ReturnType<typeof getDormConfig> | null>(null);
  const defaultBuildings = dorm?.data.buildings || [];
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isErrorsDialogOpen, setIsErrorsDialogOpen] = useState(false);
  const [selectedBuildingForErrors, setSelectedBuildingForErrors] = useState<string>('');
  const { toast } = useToast();
  const { 
    startLaundryCycle, 
    cancelTimer, 
    isMobile, 
    isNotificationsEnabled, 
    requestNotificationPermissions,
    activeTimers 
  } = useLaundryTimer();

  // Use dorm-specific collection for buildings
  const buildingsCollectionName = `${dorm?.id}_buildings`;

  // Load dorm from localStorage
  useEffect(() => {
    const selectedDormId = localStorage.getItem('selectedDorm');
    setDorm(getDormConfig(selectedDormId || undefined));
  }, []);

  const initializeMachineData = useCallback(async () => {
    if (!buildingsCollectionName || !dorm) return;
    
    console.log("Checking if machine data needs initialization...");
    const buildingsRef = collection(db, buildingsCollectionName);
    const snapshot = await getDocs(buildingsRef);

    if (snapshot.empty) {
      console.log("No data found. Initializing buildings and machines in Firestore...");
      const batch = writeBatch(db);
      defaultBuildings.forEach(building => {
        const buildingRef = doc(db, buildingsCollectionName, building.id);
        const buildingData = {
          ...building,
          machines: building.machines.map(m => ({
            ...m,
            timerEnd: null 
          }))
        };
        batch.set(buildingRef, buildingData);
      });
      await batch.commit();
      console.log("Initial data seeded in Firestore.");
    } else {
       console.log("Machine data already exists in Firestore.");
    }
  }, [buildingsCollectionName, defaultBuildings, dorm]);

  useEffect(() => {
    if (!dorm || !buildingsCollectionName) return;
    
    const setupListeners = async () => {
      await initializeMachineData();

      const unsubscribe = onSnapshot(collection(db, buildingsCollectionName), (snapshot) => {
        const buildingsData: Building[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            machines: data.machines.map((machine: any) => ({
              ...machine,
              timerEnd: machine.timerEnd instanceof Timestamp ? machine.timerEnd.toMillis() : machine.timerEnd,
            })) as Machine[],
          };
        });
        setBuildings(buildingsData);
        setIsLoading(false);
      }, (error) => {
        console.error("Error fetching buildings:", error);
        toast({
          title: "Error",
          description: "Could not fetch laundry data. Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
      });

      return unsubscribe;
    };
    
    const unsubscribePromise = setupListeners();

    return () => {
      unsubscribePromise.then(unsubscribe => unsubscribe && unsubscribe());
    };
  }, [toast, initializeMachineData, buildingsCollectionName, dorm]);


  const findMachineLocation = async (transaction: any, machineId: string) => {
    if (!dorm || !buildingsCollectionName || defaultBuildings.length === 0) {
      throw new Error("Dorm configuration not loaded yet.");
    }
    
    let buildingDoc, buildingRef, machineIndex = -1;

    for (const b of defaultBuildings) { 
      const tempIndex = b.machines.findIndex(m => m.id === machineId);
      if (tempIndex !== -1) {
        buildingRef = doc(db, buildingsCollectionName, b.id);
        const buildingDocSnap = await transaction.get(buildingRef);
        if (!buildingDocSnap.exists()) {
            throw new Error(`Building ${b.id} not found in database.`);
        }
        buildingDoc = buildingDocSnap.data() as Building;
        machineIndex = buildingDoc.machines.findIndex(m => m.id === machineId);
        break;
      }
    }
    
    if (!buildingDoc || !buildingRef || machineIndex === -1) {
      throw new Error("Could not find the machine in any building.");
    }
    
    return { building: buildingDoc, buildingRef, machineIndex };
  };

  const machinesInUseByUser = buildings
    .flatMap(b => b.machines)
    .filter(m => m.status === 'in-use' && m.apartmentUser === currentUser).length;

  const handleStartMachine = async (machineId: string, durationMinutes: number) => {
    if (!dorm || !buildingsCollectionName) {
      toast({
        title: "Error",
        description: "Dorm configuration not loaded. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }
    
    if (machinesInUseByUser >= 2) {
      toast({
        title: "Machine Limit Reached",
        description: "You can only use a maximum of 2 machines at a time.",
        variant: "destructive",
      });
      return;
    }

    try {
      await runTransaction(db, async (transaction) => {
        const { building, buildingRef, machineIndex } = await findMachineLocation(transaction, machineId);
        if (machineIndex === -1) throw new Error("Machine not found");

        const machine = building.machines[machineIndex];
        if (machine.status !== 'available') {
          throw new Error("Machine is not available to start.");
        }

        const newMachines = [...building.machines];
        newMachines[machineIndex] = {
          ...machine,
          status: 'in-use',
          timerEnd: Date.now() + durationMinutes * 60 * 1000,
          apartmentUser: currentUser,
        };
        transaction.update(buildingRef, { machines: newMachines });
      });

      // Start mobile notification timer if on mobile
      if (isMobile) {
        try {
          const machineNumber = parseInt(machineId.replace('machine-', ''));
          const cycleType = machineId.includes('wash') ? 'wash' : 'dry';
          
          await startLaundryCycle(machineNumber, cycleType, durationMinutes);
        } catch (notificationError) {
          console.error("Error starting notification timer:", notificationError);
          // Don't fail the whole operation if notifications fail
        }
      }
      
    } catch (error) {
      console.error("Error starting machine:", error);
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleMachineFinish = useCallback(async (machineId: string) => {
    if (!dorm || !buildingsCollectionName) {
      console.error("Dorm configuration not loaded");
      return;
    }
    
    try {
      await runTransaction(db, async (transaction) => {
        const { building, buildingRef, machineIndex } = await findMachineLocation(transaction, machineId);
        if (machineIndex === -1) return;

        const newMachines = [...building.machines];
        newMachines[machineIndex] = {
          ...newMachines[machineIndex],
          status: 'available',
          timerEnd: null,
          apartmentUser: null,
        };
        transaction.update(buildingRef, { machines: newMachines });
      });

      // Cancel notification timer if on mobile
      if (isMobile) {
        // Note: In a real implementation, you'd need to store the timer ID 
        // when starting the machine to be able to cancel it here
        // For now, this is handled by the notification service's internal logic
      }
      
    } catch (error) {
      console.error("Error finishing machine:", error);
    }
  }, [isMobile, dorm, buildingsCollectionName]);

  const handleOpenErrorsDialog = (buildingName: string) => {
    setSelectedBuildingForErrors(buildingName);
    setIsErrorsDialogOpen(true);
  };

  const handleReport = async (machineId: string, issue: string) => {
    if (!dorm || !buildingsCollectionName) {
      toast({
        title: "Error",
        description: "Dorm configuration not loaded. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await runTransaction(db, async (transaction) => {
        const { building, buildingRef, machineIndex } = await findMachineLocation(transaction, machineId);
        if (machineIndex === -1) throw new Error("Machine not found");
        
        const machine = building.machines[machineIndex];
        const newReport = { id: Date.now().toString(), userId: currentUser, issue };
        const newReports = [...machine.reports, newReport];
        const newMachines = [...building.machines];
        const newStatus = newReports.length >= 5 ? 'out-of-order' : machine.status;
        
        newMachines[machineIndex] = {
          ...machine,
          reports: newReports,
          status: newStatus,
        };
        transaction.update(buildingRef, { machines: newMachines });
        
        if (newStatus === 'out-of-order') {
            toast({
                title: "Machine Out of Order",
                description: `Machine ${machine.name} has been marked as out-of-order due to multiple reports.`,
                variant: "destructive"
            });
        }
      });
    } catch (error) {
      console.error("Error reporting issue:", error);
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    }
  };
  
  const handleResolveReport = async (machineId: string, reportId: string) => {
    if (!dorm || !buildingsCollectionName) {
      toast({
        title: "Error",
        description: "Dorm configuration not loaded. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await runTransaction(db, async (transaction) => {
        const { building, buildingRef, machineIndex } = await findMachineLocation(transaction, machineId);
        if (machineIndex === -1) throw new Error("Machine not found");
        
        const machine = building.machines[machineIndex];
        const newReports = machine.reports.filter(r => r.id !== reportId);
        const newMachines = [...building.machines];

        newMachines[machineIndex] = {
          ...machine,
          reports: newReports,
          status: machine.status === 'out-of-order' && newReports.length < 5 ? 'available' : machine.status,
        };
        transaction.update(buildingRef, { machines: newMachines });
      });
       toast({ title: "Success", description: "Report has been resolved." });
    } catch (error) {
      console.error("Error resolving report:", error);
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleWarning = async (machineId: string, message: string) => {
    if (!dorm || !buildingsCollectionName) {
      toast({
        title: "Error",
        description: "Dorm configuration not loaded. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await runTransaction(db, async (transaction) => {
        const { building, buildingRef, machineIndex } = await findMachineLocation(transaction, machineId);
        if (machineIndex === -1) throw new Error("Machine not found");
        
        const machine = building.machines[machineIndex];
        const newWarning = { id: Date.now().toString(), userId: currentUser, message };
        const newWarnings = [...machine.warnings, newWarning];
        const newMachines = [...building.machines];
        newMachines[machineIndex] = {
          ...machine,
          warnings: newWarnings,
        };
        transaction.update(buildingRef, { machines: newMachines });
      });
    } catch (error)      {
      console.error("Error sending warning:", error);
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    }
  };
  
  const handleResolveWarning = async (machineId: string, warningId: string) => {
    if (!dorm || !buildingsCollectionName) {
      toast({
        title: "Error",
        description: "Dorm configuration not loaded. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await runTransaction(db, async (transaction) => {
        const { building, buildingRef, machineIndex } = await findMachineLocation(transaction, machineId);
        if (machineIndex === -1) throw new Error("Machine not found");
        
        const machine = building.machines[machineIndex];
        const newWarnings = machine.warnings.filter(w => w.id !== warningId);
        const newMachines = [...building.machines];
        newMachines[machineIndex] = {
          ...machine,
          warnings: newWarnings,
        };
        transaction.update(buildingRef, { machines: newMachines });
      });
      toast({ title: "Success", description: "Warning has been resolved." });
    } catch (error) {
      console.error("Error resolving warning:", error);
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    }
  };


  if (isLoading) {
    return (
       <div className="space-y-8 p-4 md:p-8">
         <section>
          <Skeleton className="h-10 w-1/3 mb-4" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </section>
      </div>
    );
  }

  const filteredBuildings = selectedBuildingId === 'all'
    ? buildings
    : buildings.filter(b => b.id === selectedBuildingId);

  if (filteredBuildings.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-2xl font-semibold">No Machines Found</h2>
        <p className="text-muted-foreground mt-2">
          {selectedBuildingId === 'all' 
            ? "There are no buildings or machines defined in the code." 
            : "This building has no machines defined or does not exist."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Buildings and Machines */}
      {filteredBuildings.map(building => (
        <section key={building.id}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold tracking-tight font-headline">{building.name}</h2>
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => handleOpenErrorsDialog(building.name)}
            >
              Errors
            </Button>
          </div>

          {/* Washers Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Washers</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {building.machines.filter(m => m.type === 'washer').map(machine => (
                <MachineCard 
                  key={machine.id} 
                  machine={machine} 
                  currentUser={currentUser}
                  onStart={handleStartMachine}
                  onFinish={handleMachineFinish}
                  onReport={handleReport}
                  onWarning={handleWarning}
                  canStartNewMachine={machinesInUseByUser < 2}
                  onResolveReport={handleResolveReport}
                  onResolveWarning={handleResolveWarning}
                />
              ))}
            </div>
          </div>

          {/* Dryers Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-orange-600">Dryers</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {building.machines.filter(m => m.type === 'dryer').map(machine => (
                <MachineCard 
                  key={machine.id} 
                  machine={machine} 
                  currentUser={currentUser}
                  onStart={handleStartMachine}
                  onFinish={handleMachineFinish}
                  onReport={handleReport}
                  onWarning={handleWarning}
                  canStartNewMachine={machinesInUseByUser < 2}
                  onResolveReport={handleResolveReport}
                  onResolveWarning={handleResolveWarning}
                />
              ))}
            </div>
          </div>
        </section>
      ))}
      
      <ErrorsDialog 
        isOpen={isErrorsDialogOpen}
        onClose={() => setIsErrorsDialogOpen(false)}
        buildingName={selectedBuildingForErrors}
      />
    </div>
  );
}
