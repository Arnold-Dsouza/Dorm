import type { Building, PageContent } from '@/lib/types';

export const tabuBuildings: Building[] = [
  {
    id: 'bldg-58',
    name: 'Building 58',
    machines: [
      { id: 'w1-58', name: 'Washer 1', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null, reports: [], warnings: [] },
      { id: 'w2-58', name: 'Washer 2', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null, reports: [], warnings: [] },
      { id: 'w3-58', name: 'Washer 3', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null, reports: [], warnings: [] },
      { id: 'd1-58', name: 'Dryer 1', type: 'dryer', status: 'available', timerEnd: null, apartmentUser: null, reports: [], warnings: [] },
    ],
  },
  {
    id: 'bldg-60',
    name: 'Building 60',
    machines: [
      { id: 'w1-60', name: 'Washer 1', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null, reports: [], warnings: [] },
      { id: 'w2-60', name: 'Washer 2', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null, reports: [], warnings: [] },
      { id: 'd1-60', name: 'Dryer 1', type: 'dryer', status: 'available', timerEnd: null, apartmentUser: null, reports: [], warnings: [] },
    ],
  },
  {
    id: 'bldg-62',
    name: 'Building 62',
    machines: [
      { id: 'w1-62', name: 'Washer 1', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null, reports: [], warnings: [] },
      { id: 'w2-62', name: 'Washer 2', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null, reports: [], warnings: [] },
      { id: 'w3-62', name: 'Washer 3', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null, reports: [], warnings: [] },
      { id: 'd1-62', name: 'Dryer 1', type: 'dryer', status: 'available', timerEnd: null, apartmentUser: null, reports: [], warnings: [] },
    ],
  },
  {
    id: 'bldg-64',
    name: 'Building 64',
    machines: [
      { id: 'w1-64', name: 'Washer 1', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null, reports: [], warnings: [] },
      { id: 'w2-64', name: 'Washer 2', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null, reports: [], warnings: [] },
      { id: 'w3-64', name: 'Washer 3', type: 'washer', status: 'available', timerEnd: null, apartmentUser: null, reports: [], warnings: [] },
      { id: 'd1-64', name: 'Dryer 1', type: 'dryer', status: 'available', timerEnd: null, apartmentUser: null, reports: [], warnings: [] },
    ],
  },
];

export const tabuFitnessRoom: PageContent = {
  id: 'fitnessRoom',
  schedule: [
    { day: 'Tuesday', hours: '6:00 PM - 8:00 PM' },
    { day: 'Friday', hours: '6:00 PM - 8:00 PM' },
    { day: 'Sunday', hours: '6:00 PM - 8:00 PM' },
  ],
  upcomingEvents: [
    { id: 'event1', title: 'Yoga Session', date: 'August 5, 2024', time: '7:00 PM', location: 'Main Hall' },
    { id: 'event2', title: 'Cardio Challenge', date: 'August 12, 2024', time: '6:30 PM', location: 'Fitness Room' },
  ],
  passedEvents: [
    { id: 'event3', title: 'Spinning Marathon', date: 'July 20, 2024' },
    { id: 'event4', title: 'Weightlifting Workshop', date: 'July 15, 2024' },
  ],
};

export const tabuTeaRoom: PageContent = {
  id: 'teaRoom',
  schedule: [
    { day: 'Monday', hours: '4:00 PM - 7:00 PM' },
    { day: 'Thursday', hours: '4:00 PM - 7:00 PM' },
  ],
  specialMenu: [
    { id: 'menu1', name: 'Matcha Latte', price: '€ 3.0' },
    { id: 'menu2', name: 'Bubble Tea', price: '€ 3.5' },
    { id: 'menu3', name: 'Scones with Cream', price: '€ 2.5' },
  ],
  usualMenu: [
    { id: 'menu4', name: 'Assam Black Tea', price: '€ 1.5' },
    { id: 'menu5', name: 'Green Tea', price: '€ 1.5' },
    { id: 'menu6', name: 'Herbal Infusion', price: '€ 1.5' },
    { id: 'menu7', name: 'Shortbread Cookies', price: '€ 1' },
  ],
  upcomingEvents: [
    { id: 'event1', title: 'Tea Tasting', date: 'August 22, 2024', time: '5:00 PM', location: 'Tea Room' },
  ],
  passedEvents: [
    { id: 'event2', title: 'High Tea Special', date: 'July 18, 2024' },
  ],
  privatePartiesContact: 'us',
};

export const tabuCafeteria: PageContent = {
  id: 'tabuCafeteria',
  schedule: [
    { day: 'Wednesday', hours: '5:00 PM - 8:00 PM' },
    { day: 'Sunday', hours: '5:00 PM - 8:00 PM' },
  ],
  specialMenu: [
    { id: 'menu1', name: 'Mango Cheesecake', price: '€ 2.5' },
    { id: 'menu2', name: 'Fruit Popsicle Eis', price: '€ 1' },
    { id: 'menu3', name: 'Spaghetti Icecream', price: '€ 1.5' },
    { id: 'menu4', name: 'Vanilla Berry Sunday', price: '€ 2' },
  ],
  usualMenu: [
    { id: 'menu5', name: 'Pommes', price: '€ 2 / € 1.5' },
    { id: 'menu6', name: 'Chicken Wings', price: '2-3 Pcs' },
    { id: 'menu7', name: 'Iced Coffee Latte', price: '€ 1.5' },
    { id: 'menu8', name: 'Warm Tea', price: '€ 0.50' },
    { id: 'menu9', name: 'Desi Chai', price: '€ 1.5' },
    { id: 'menu10', name: 'Pan Cakes + Berries', price: '€ 2' },
    { id: 'menu11', name: 'Brownies', price: '1.5 - 2 Pcs' },
    { id: 'menu12', name: 'Peach ice tea', price: '€ 1' },
  ],
  upcomingEvents: [
    { id: 'event1', title: 'Taco Tuesday', date: 'August 13, 2024', time: '12:00 PM', location: 'Cafeteria' },
  ],
  passedEvents: [
    { id: 'event2', title: 'Pancake Breakfast', date: 'July 9, 2024' },
  ],
  privatePartiesContact: 'ABC',
};

export const tabuBar: PageContent = {
  id: 'tabuBar',
  schedule: [
    { day: 'Friday', hours: '8:00 PM onwards' },
  ],
  upcomingEvents: [
    { id: 'event1', title: 'Karaoke Night', date: 'August 16, 2024', time: '9:00 PM', location: 'Main Bar Area' },
  ],
  passedEvents: [
    { id: 'event2', title: 'Oktoberfest Pre-party', date: 'July 26, 2024' },
  ],
  privatePartiesContact: 'XYZ',
};

export const tabuPropertyManagement: PageContent = {
  id: 'propertyManagement',
  changeOfResponsibility: 'Change of responsibility as of 01.03.2025',
  managers: [
    { id: 'manager1', name: 'Patrick Kühnlein', house: 'House 64', email: 'wh.hirschbergerstr@studierendenwerk-bonn.de', phone: '01515-4754233' },
    { id: 'manager2', name: 'Maksim Setkin', house: 'House 62', email: 'wh.hirschbergerstr@studierendenwerk-bonn.de', phone: '0175-7589714' },
    { id: 'manager3', name: 'Arno Geslerski', house: 'House 60', email: 'wh.hirschbergerstr@studierendenwerk-bonn.de', phone: '01517-4420357' },
    { id: 'manager4', name: 'Jürgen Bung', house: 'House 58', email: 'wh.hirschbergerstr@studierendenwerk-bonn.de', phone: '0175-8699982' },
  ],
};
