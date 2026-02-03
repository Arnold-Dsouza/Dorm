
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import LaundryDashboard from '@/components/laundry-dashboard';
import FitnessRoom from '@/components/fitness-room';
import TabuCafeteria from '@/components/tabu-cafeteria';
import TabuBar from '@/components/tabu-bar';
import TeaRoom from '@/components/tea-room';
import PropertyManagement from '@/components/property-management';
import NetworkMentor from '@/components/network-mentor';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from '@/components/ui/sidebar';
import { getDormConfig } from '@/dorms/registry';
import { Building as BuildingIcon, Home as HomeIcon, Dumbbell, Coffee, Utensils, Martini, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type View = 'laundry' | 'fitness' | 'tea' | 'cafeteria' | 'bar' | 'propertyManagement' | 'networkMentor';

function PageContent() {
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [activeView, setActiveView] = useState<View>('laundry');
  const [userApartment, setUserApartment] = useState<string>('');
  const [userDormId, setUserDormId] = useState<string>('');
  const { isMobile, setOpenMobile } = useSidebar();
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  
  // Get dorm config based on user's dorm or selected dorm
  const dorm = getDormConfig(userDormId || undefined);
  const buildings = dorm.data.buildings;
  const servicesLabel = dorm.displayName ?? dorm.name;
  const allBuildingsLabel = dorm.labels?.allBuildings ?? 'All Buildings';
  
  const currentUserApartment = userApartment || "Temp Apt"; // Use fetched apartment or fallback

  useEffect(() => {
    // Only redirect if we're sure the user is not authenticated and loading is complete
    if (!loading && !user) {
      // Add a small delay to ensure auth state is properly synchronized
      const timer = setTimeout(() => {
        router.push('/select-dorm');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [user, loading, router]);

  // Fetch user's apartment number and dorm from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserApartment(userData.apartmentNumber || '');
            setUserDormId(userData.dormId || '');
            
            // Also update localStorage with user's dorm
            if (userData.dormId) {
              localStorage.setItem('selectedDorm', userData.dormId);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);


  const handleBuildingSelect = (buildingId: string) => {
    setSelectedBuilding(buildingId);
    setActiveView('laundry');
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  
  const handleViewSelect = (view: View) => {
    setActiveView(view);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const isTabu2View = ['fitness', 'tea', 'cafeteria', 'bar', 'propertyManagement'].includes(activeView);
  const headerTitle = isTabu2View
    ? dorm.labels?.secondaryHeader ?? servicesLabel
    : dorm.labels?.primaryHeader ?? 'LaundryView';


  if (loading || !user) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background p-4 md:p-8">
        <Skeleton className="h-16 w-full mb-4" />
        <div className="flex gap-8">
          <Skeleton className="hidden md:block w-64 h-[calc(100vh-100px)]" />
          <div className="flex-1 space-y-8">
            <Skeleton className="h-10 w-1/3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Sidebar>
        <SidebarHeader></SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarGroup>
                <SidebarGroupLabel>Laundry</SidebarGroupLabel>
                <SidebarMenu>
                  {buildings.length > 1 && (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={() => handleBuildingSelect('all')}
                        isActive={activeView === 'laundry' && selectedBuilding === 'all'}
                        tooltip={allBuildingsLabel}
                      >
                        <HomeIcon />
                        <span>{allBuildingsLabel}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  {buildings.map((building) => (
                    <SidebarMenuItem key={building.id}>
                      <SidebarMenuButton
                        onClick={() => handleBuildingSelect(building.id)}
                        isActive={activeView === 'laundry' && selectedBuilding === building.id}
                        tooltip={building.name}
                      >
                        <BuildingIcon />
                        <span>{building.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarMenuItem>
            {(dorm.features.fitness || dorm.features.teaRoom || dorm.features.cafeteria || dorm.features.bar) && (
              <SidebarMenuItem>
                <SidebarGroup>
                  <SidebarGroupLabel>{dorm.labels?.secondaryHeader ?? 'Services'}</SidebarGroupLabel>
                  <SidebarMenu>
                    {dorm.features.fitness && (
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip={dorm.labels?.fitness ?? 'Fitness Room'} onClick={() => handleViewSelect('fitness')} isActive={activeView === 'fitness'}>
                          <Dumbbell />
                          <span>{dorm.labels?.fitness ?? 'Fitness Room'}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {dorm.features.teaRoom && (
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip={dorm.labels?.teaRoom ?? 'Tea Room'} onClick={() => handleViewSelect('tea')} isActive={activeView === 'tea'}>
                          <Coffee />
                          <span>{dorm.labels?.teaRoom ?? 'Tea Room'}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {dorm.features.cafeteria && (
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip={dorm.labels?.cafeteria ?? 'Cafeteria'} onClick={() => handleViewSelect('cafeteria')} isActive={activeView === 'cafeteria'}>
                          <Utensils />
                          <span>{dorm.labels?.cafeteria ?? 'Cafeteria'}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {dorm.features.bar && (
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip={dorm.labels?.bar ?? 'Bar'} onClick={() => handleViewSelect('bar')} isActive={activeView === 'bar'}>
                          <Martini />
                          <span>{dorm.labels?.bar ?? 'Bar'}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </SidebarMenu>
                </SidebarGroup>
              </SidebarMenuItem>
            )}
            {dorm.features.propertyManagement && (
              <SidebarMenuItem>
                <SidebarGroup>
                  <SidebarGroupLabel>{dorm.labels?.propertyManagement ?? 'Property Management'}</SidebarGroupLabel>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton tooltip="View Contacts" onClick={() => handleViewSelect('propertyManagement')} isActive={activeView === 'propertyManagement'}>
                        <BuildingIcon />
                        <span>Contacts</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroup>
              </SidebarMenuItem>
            )}
            {dorm.features.networkMentor && (
              <SidebarMenuItem>
                <SidebarGroup>
                  <SidebarGroupLabel>{dorm.labels?.networkMentor ?? 'Network Mentors'}</SidebarGroupLabel>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton tooltip="Network Support" onClick={() => handleViewSelect('networkMentor')} isActive={activeView === 'networkMentor'}>
                        <Users />
                        <span>Mentors</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroup>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-screen min-h-[100dvh] w-full flex-col bg-background">
          <Header currentUser={userApartment} title={headerTitle} />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 pb-[env(safe-area-inset-bottom)]">
             {activeView === 'laundry' && dorm.features.laundry && <LaundryDashboard selectedBuildingId={selectedBuilding} currentUser={currentUserApartment} />}
             {activeView === 'fitness' && dorm.features.fitness && <FitnessRoom title={dorm.labels?.fitness} />}
             {activeView === 'cafeteria' && dorm.features.cafeteria && <TabuCafeteria title={dorm.labels?.cafeteria} />}
             {activeView === 'bar' && dorm.features.bar && <TabuBar title={dorm.labels?.bar} />}
             {activeView === 'tea' && dorm.features.teaRoom && <TeaRoom title={dorm.labels?.teaRoom} />}
             {activeView === 'propertyManagement' && dorm.features.propertyManagement && <PropertyManagement />}
             {activeView === 'networkMentor' && dorm.features.networkMentor && <NetworkMentor title={dorm.labels?.networkMentor} />}
          </main>
        </div>
      </SidebarInset>
    </>
  );
}

export default function Home() {
  return (
    <SidebarProvider>
      <PageContent />
    </SidebarProvider>
  );
}
