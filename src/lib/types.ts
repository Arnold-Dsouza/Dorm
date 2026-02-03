
export type MachineStatus = 'available' | 'in-use' | 'out-of-order';

export interface Report {
  id: string;
  userId: string;
  issue: string;
}

export interface Warning {
  id: string;
  userId: string;
  message: string;
}

export interface Machine {
  id: string;
  name: string;
  type: 'washer' | 'dryer';
  status: MachineStatus;
  timerEnd: number | null;
  apartmentUser: string | null;
  reports: Report[];
  warnings: Warning[];
}

export interface Building {
  id: string;
  name: string;
  machines: Machine[];
}

// Dorm Types
export interface ScheduleItem {
  day: string;
  hours: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
  pictures?: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  price: string;
}

export interface ManagerItem {
  id: string;
  name: string;
  house: string;
  email: string;
  phone: string;
}

export interface PageContent {
  id: string;
  schedule?: ScheduleItem[];
  upcomingEvents?: EventItem[];
  passedEvents?: EventItem[];
  specialMenu?: MenuItem[];
  usualMenu?: MenuItem[];
  privatePartiesContact?: string;
  changeOfResponsibility?: string;
  managers?: ManagerItem[];
  helpDescription?: string;
  helpResponseTime?: string;
  helpOfficeHours?: string;
  completedTasks?: CompletedTask[];
}

export interface CompletedTask {
  id: string;
  issue: string;
  resolution: string;
  timestamp?: number;
}
