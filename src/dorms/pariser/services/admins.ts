// Pariser Straße admin access control
// Add room numbers (3-digit format) to grant edit access to specific pages

export const adminAccess: Record<string, string[]> = {
  fitnessRoom: ['203', '515'], // Example: Room 203, Room 515
  teaRoom: ['203', '515'],
  cafeteria: ['203', '515'],
  bar: ['203', '515', '234'],
  propertyManagement: ['234', '515'],
  networkMentor: ['234', '515'],
};
