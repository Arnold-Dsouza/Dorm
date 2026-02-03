/**
 * Admin configuration for TABU-specific pages.
 * Add the 5-digit apartment number as a string to grant edit access.
 */
interface AdminAccess {
  fitnessRoom: string[];
  teaRoom: string[];
  tabuCafeteria: string[];
  tabuBar: string[];
  propertyManagement: string[];
}

export const adminAccess: AdminAccess = {
  fitnessRoom: ['42345'],
  teaRoom: ['42345'],
  tabuCafeteria: ['42345'],
  tabuBar: ['42345'],
  propertyManagement: ['42345'],
};
