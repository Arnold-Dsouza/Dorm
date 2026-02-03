import type { Building, PageContent } from '@/lib/types';

export interface DormFeatureFlags {
  laundry?: boolean;
  notifications?: boolean;
  fitness?: boolean;
  teaRoom?: boolean;
  cafeteria?: boolean;
  bar?: boolean;
  propertyManagement?: boolean;
}

export interface DormLabels {
  primaryHeader?: string;
  secondaryHeader?: string;
  allBuildings?: string;
  fitness?: string;
  teaRoom?: string;
  cafeteria?: string;
  bar?: string;
  propertyManagement?: string;
}

export interface DormData {
  buildings: Building[];
  fitness?: PageContent;
  teaRoom?: PageContent;
  cafeteria?: PageContent;
  bar?: PageContent;
  propertyManagement?: PageContent;
}

export interface DormConfig {
  id: string;
  slug: string;
  name: string;
  displayName?: string;
  description?: string;
  imageUrl?: string;
  features: DormFeatureFlags;
  data: DormData;
  labels?: DormLabels;
  roomValidation?: {
    pattern: RegExp;
    description: string;
    floors?: string[];
    roomRange?: { min: number; max: number };
  };
}

export type DormRegistry = Record<string, DormConfig>;
