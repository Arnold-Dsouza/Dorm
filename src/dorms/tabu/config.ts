import type { DormConfig } from '@/dorms/types';
import {
  tabuBar,
  tabuBuildings,
  tabuCafeteria,
  tabuFitnessRoom,
  tabuPropertyManagement,
  tabuTeaRoom,
} from './data';

export const tabuDorm: DormConfig = {
  id: 'tabu',
  slug: 'tabu',
  name: 'Tannenbusch 2',
  displayName: 'Tannenbusch 2',
  description: 'Community and services app for Tannenbusch residents - Hirschberger Str. 58-64',
  imageUrl: '/tabu2.jpg',
  labels: {
    primaryHeader: 'LaundryView',
    secondaryHeader: 'Tannenbusch 2',
    allBuildings: 'All Buildings',
    fitness: 'Fitness Room',
    teaRoom: 'Tea Room',
    cafeteria: 'TABU Cafeteria',
    bar: 'TABU Bar',
    propertyManagement: 'Property Management',
  },
  features: {
    laundry: true,
    notifications: true,
    fitness: true,
    teaRoom: true,
    cafeteria: true,
    bar: true,
    propertyManagement: true,
  },
  roomValidation: {
    pattern: /^(402|412|424|437)[0-5][0-9]$/,
    description: 'Floors 402/412/424/437, rooms 00-60 (e.g., 40211)',
    floors: ['402', '412', '424', '437'],
    roomRange: { min: 0, max: 60 },
  },
  data: {
    buildings: tabuBuildings,
    fitness: tabuFitnessRoom,
    teaRoom: tabuTeaRoom,
    cafeteria: tabuCafeteria,
    bar: tabuBar,
    propertyManagement: tabuPropertyManagement,
  },
};
