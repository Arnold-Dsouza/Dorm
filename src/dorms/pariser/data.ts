import type { Building, PageContent } from '@/lib/types';

// Pariser Straße has 7 floors with rooms 100-140
// Room format: 3-digit (floor + room number)
// Examples: 203 (floor 2, room 03), 515 (floor 5, room 15)

export const pariserBuildings: Building[] = [
  {
    id: 'pariser-main',
    name: 'Pariser Straße 54',
    machines: [
      { id: 'pw1', name: 'Washer 1', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null, reports: [], warnings: [] },
      { id: 'pw2', name: 'Washer 2', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null, reports: [], warnings: [] },
      { id: 'pw3', name: 'Washer 3', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null, reports: [], warnings: [] },
      { id: 'pw4', name: 'Washer 4', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null, reports: [], warnings: [] },
      { id: 'pw5', name: 'Washer 5', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null, reports: [], warnings: [] },
      { id: 'pd1', name: 'Dryer 1', type: 'dryer', status: 'available', timerEnd: null, apartmentUser: null, reports: [], warnings: [] },
      { id: 'pd2', name: 'Dryer 2', type: 'dryer', status: 'available', timerEnd: null, apartmentUser: null, reports: [], warnings: [] },
      { id: 'pd3', name: 'Dryer 3', type: 'dryer', status: 'available', timerEnd: null, apartmentUser: null, reports: [], warnings: [] },
      { id: 'pd4', name: 'Dryer 4', type: 'dryer', status: 'available', timerEnd: null, apartmentUser: null, reports: [], warnings: [] },
      { id: 'pd5', name: 'Dryer 5', type: 'dryer', status: 'available', timerEnd: null, apartmentUser: null, reports: [], warnings: [] },
    ],
  },
];

export const pariserFitnessRoom: PageContent = {
  id: 'fitnessRoom',
  schedule: [
    { day: 'Monday - Friday', hours: '6:00 AM - 11:00 PM' },
    { day: 'Saturday - Sunday', hours: '8:00 AM - 10:00 PM' },
  ],
  specialMenu: [],
  usualMenu: [],
  upcomingEvents: [],
  passedEvents: [],
  privatePartiesContact: 'fitness@pariser.de',
};

export const pariserTeaRoom: PageContent = {
  id: 'teaRoom',
  schedule: [
    { day: 'Monday - Thursday', hours: '3:00 PM - 10:00 PM' },
    { day: 'Friday', hours: '3:00 PM - 11:00 PM' },
    { day: 'Saturday - Sunday', hours: '2:00 PM - 11:00 PM' },
  ],
  specialMenu: [],
  usualMenu: [],
  upcomingEvents: [],
  passedEvents: [],
  privatePartiesContact: 'tearoom@pariser.de',
};

export const pariserCafeteria: PageContent = {
  id: 'cafeteria',
  schedule: [
    { day: 'Monday - Friday', hours: '7:30 AM - 2:00 PM, 5:00 PM - 8:00 PM' },
    { day: 'Saturday', hours: '9:00 AM - 2:00 PM' },
    { day: 'Sunday', hours: 'Closed' },
  ],
  specialMenu: [],
  usualMenu: [],
  upcomingEvents: [],
  passedEvents: [],
  privatePartiesContact: 'cafeteria@pariser.de',
};

export const pariserBar: PageContent = {
  id: 'bar',
  schedule: [
    { day: 'Wednesday - Saturday', hours: '7:00 PM - 1:00 AM' },
    { day: 'Sunday - Tuesday', hours: 'Closed' },
  ],
  specialMenu: [],
  usualMenu: [],
  upcomingEvents: [],
  passedEvents: [],
  privatePartiesContact: 'bar@pariser.de',
};

export const pariserPropertyManagement: PageContent = {
  id: 'propertyManagement',
  schedule: [
    { day: 'Monday - Thursday', hours: '9:00 AM - 4:00 PM' },
    { day: 'Friday', hours: '9:00 AM - 2:00 PM' },
  ],
  specialMenu: [],
  usualMenu: [],
  upcomingEvents: [],
  passedEvents: [],
  privatePartiesContact: 'management@pariser.de',
  managers: [
    { id: 'manager1', name: 'Sophie Neumann', house: 'House 54', email: 's.neumann@studierendenwerk-bonn.de', phone: '+49 228 73 71 66' },
  ],
};
export const pariserNetworkMentor: PageContent = {
  id: 'networkMentor',
  schedule: [
    { day: 'Monday - Friday', hours: 'Available for consultation' },
  ],
  specialMenu: [],
  usualMenu: [],
  upcomingEvents: [],
  passedEvents: [],
  privatePartiesContact: 'network@pariser.de',
  managers: [
    { id: 'mentor1', name: 'Marius', house: 'Network Mentor', email: 'marius@gmail.com', phone: '+49xxx' },
    { id: 'mentor2', name: 'Paola', house: 'Network Mentor', email: 'paola@gmail.com', phone: '+49xxx' },
    { id: 'mentor3', name: 'Eric', house: 'Network Mentor', email: 'eric@gmail.com', phone: '+49xxx' },
    { id: 'mentor4', name: 'Rachid', house: 'Network Mentor', email: 'rachid@gmail.com', phone: '+49xxx' },
    { id: 'mentor5', name: 'Jack', house: 'Network Mentor', email: 'jack@gmail.com', phone: '+49xxx' },
  ],
  helpDescription: 'If your issue is not listed above or you need immediate assistance, please reach out to any of our network mentors above. We\'re here to help with WiFi connectivity, network speeds, connection problems, and other technical issues.',
  helpResponseTime: 'Usually within 24 hours',
  helpOfficeHours: 'Monday - Friday during office hours',
  completedTasks: [],
};