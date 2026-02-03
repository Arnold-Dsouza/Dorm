// Dynamic re-export based on selected dorm
// This file acts as a facade that routes to the correct dorm's services

import * as tabuServices from '@/dorms/tabu/services/firestore-service';
import * as pariserServices from '@/dorms/pariser/services/firestore-service';
import type { PageContent } from './types';

function getSelectedDormId(): string {
  if (typeof window === 'undefined') return 'tabu'; // Default for SSR
  return localStorage.getItem('selectedDorm') || 'tabu';
}

function getDormServices() {
  const dormId = getSelectedDormId();
  switch (dormId) {
    case 'pariser':
      return pariserServices;
    case 'tabu':
    default:
      return tabuServices;
  }
}

export async function getPageContent(pageId: string): Promise<PageContent> {
  const services = getDormServices();
  return services.getPageContent(pageId);
}

export function subscribeToPageContent(pageId: string, callback: (data: PageContent) => void) {
  const services = getDormServices();
  return services.subscribeToPageContent(pageId, callback);
}

export async function updatePageContent(pageId: string, data: PageContent): Promise<void> {
  const services = getDormServices();
  return services.updatePageContent(pageId, data);
}
