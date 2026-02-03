import type { DormConfig } from '@/dorms/types';
import {
  pariserBar,
  pariserBuildings,
  pariserCafeteria,
  pariserFitnessRoom,
  pariserPropertyManagement,
  pariserTeaRoom,
  pariserNetworkMentor,
} from './data';

export const pariserDorm: DormConfig = {
  id: 'pariser',
  slug: 'pariser',
  name: 'Pariser Straße',
  displayName: 'Dorm 2',
  description: 'Student residence at Pariser Straße 54 - 7 floors, rooms 100-140',
  imageUrl: '/pariser.jpg', // Add image to public folder
  labels: {
    primaryHeader: 'Laundry',
    secondaryHeader: 'Pariser Services',
    allBuildings: 'All Buildings',
    fitness: 'Fitness Room',
    teaRoom: 'Tea Room',
    cafeteria: 'Cafeteria',
    bar: 'Pariser Bar',
    propertyManagement: 'Building Management',
    networkMentor: 'Network Mentors',
  },
  features: {
    laundry: true,
    notifications: true,
    fitness: false,
    teaRoom: false,
    cafeteria: false,
    bar: true,
    propertyManagement: true,
    networkMentor: true,
  },
  roomValidation: {
    pattern: /^[1-7](0[0-9]|[1-3][0-9]|40)$/,
    description: 'Floors 1-7, rooms 00-40 (e.g., 203, 515)',
    floors: ['1', '2', '3', '4', '5', '6', '7'],
    roomRange: { min: 0, max: 40 },
  },
  data: {
    buildings: pariserBuildings,
    fitness: pariserFitnessRoom,
    teaRoom: pariserTeaRoom,
    cafeteria: pariserCafeteria,
    bar: pariserBar,
    propertyManagement: pariserPropertyManagement,
    networkMentor: pariserNetworkMentor,
  },
};
