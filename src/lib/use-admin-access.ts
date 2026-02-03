// Dynamic re-export based on selected dorm
import * as tabuAdminHook from '@/dorms/tabu/services/use-admin-access';
import * as pariserAdminHook from '@/dorms/pariser/services/use-admin-access';

function getSelectedDormId(): string {
  if (typeof window === 'undefined') return 'tabu'; // Default for SSR
  return localStorage.getItem('selectedDorm') || 'tabu';
}

export function useAdminAccess(pageType: string) {
  const dormId = getSelectedDormId();
  
  switch (dormId) {
    case 'pariser':
      return pariserAdminHook.useAdminAccess(pageType as any);
    case 'tabu':
    default:
      return tabuAdminHook.useAdminAccess(pageType as any);
  }
}
