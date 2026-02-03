# Dorms - Multi-Dormitory PWA Platform

## Overview

Dorms is a unified Progressive Web App (PWA) for managing dormitory services across multiple locations. Each dorm has its own isolated configuration, services, and data, making it easy to add new dormitories to the system.

## Current Dorms

- **TABU** (`src/dorms/tabu/`)
  - Full laundry management system
  - Cafeteria, bar, tea room, fitness room
  - Browser notifications (PWA)
  - Property management contacts

## Project Structure

```
src/
├── dorms/
│   ├── types.ts              # Shared dorm configuration types
│   ├── registry.ts           # Central dorm registry
│   └── tabu/                 # TABU-specific implementation
│       ├── config.ts         # TABU configuration
│       ├── data.ts           # TABU buildings, menus, schedules
│       └── services/         # TABU-scoped services
│           ├── tabu-notifications.ts
│           ├── firestore-service.ts
│           ├── use-admin-access.ts
│           └── admins.ts
├── lib/                      # Shared re-export layer
│   ├── tabu-notifications.ts   # Re-exports from tabu/services
│   ├── firestore-service.ts
│   ├── use-admin-access.ts
│   └── admins.ts
└── components/               # UI components (consume shared lib)
    ├── laundry-dashboard.tsx
    ├── notification-settings.tsx
    └── ...
```

## Adding a New Dorm

### 1. Create Dorm Folder Structure

```bash
src/dorms/
└── new-dorm/
    ├── config.ts          # Dorm configuration (DormConfig type)
    ├── data.ts            # Buildings, menus, schedules
    └── services/          # Dorm-specific services
        ├── notifications.ts     (optional override)
        ├── firestore-service.ts (optional override)
        └── admins.ts            (optional)
```

### 2. Define Configuration (`new-dorm/config.ts`)

```typescript
import type { DormConfig } from '@/dorms/types';
import { buildings, ... } from './data';

export const newDormConfig: DormConfig = {
  id: 'new-dorm',
  slug: 'new-dorm',
  name: 'New Dorm Name',
  displayName: 'Display Name',
  description: 'Community app for New Dorm residents',
  labels: {
    primaryHeader: 'LaundryView',
    secondaryHeader: 'New Dorm',
    allBuildings: 'All Buildings',
  },
  features: {
    laundry: true,
    notifications: true,
    fitness: false,  // Disable if not needed
    // ... other features
  },
  data: {
    buildings,
    // ... other data
  },
};
```

### 3. Add Data (`new-dorm/data.ts`)
```typescript
import type { Building, PageContent } from '@/lib/types';

export const buildings: Building[] = [
  {
    id: 'bldg-1',
    name: 'Building 1',
    machines: [
      { id: 'w1-1', name: 'Washer 1', type: 'washer', status: 'available', ... },
      // ... more machines
    ],
  },
  // ... more buildings
];

export const fitnessRoom: PageContent = { ... };
// ... other content
```

### 4. Register in Registry (`src/dorms/registry.ts`)
```typescript
import { tabuDorm } from './tabu/config';
import { newDormConfig } from './new-dorm/config';

export const dormRegistry: Record<string, DormConfig> = {
  tabu: tabuDorm,
  'new-dorm': newDormConfig,  // Add here
};

export const defaultDormId = 'tabu'; // Or change default
```

### 5. Optional: Custom Services
If your dorm needs custom notification logic, Firestore collection names, or update sources:

**`new-dorm/services/firestore-service.ts`**
```typescript
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'newDormContent';  // Custom collection

export async function getPageContent(pageId: string) {
  const docRef = doc(db, COLLECTION_NAME, pageId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}
// ... other methods
```

**`new-dorm/services/update-manager.ts`**
```typescript
const GITHUB_REPO = 'MyOrg/NewDormApp';  // Custom repo

export async function checkForUpdates(): Promise<UpdateInfo> {
  // Same logic as TABU but uses GITHUB_REPO above
}
```

Then update shared re-exports in `src/lib/` to point to the new dorm's services if needed, or keep TABU as default.

### 6. Update Shared Re-Exports (if needed)
If you want the new dorm to be the default, update `src/lib/firestore-service.ts`, `src/lib/update-manager.ts`, etc. to re-export from `new-dorm/services` instead of `tabu/services`.

```typescript
// src/lib/firestore-service.ts
export * from '../dorms/new-dorm/services/firestore-service';
```

Or keep TABU as default and conditionally load services based on selected dorm at runtime.

## Configuration Types

### DormConfig Interface
```typescript
export interface DormConfig {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  description: string;
  labels: {
    primaryHeader: string;
    secondaryHeader: string;
    allBuildings: string;
  };
  features: {
    laundry: boolean;
    notifications: boolean;
    fitness: boolean;
    teaRoom: boolean;
    cafeteria: boolean;
    bar: boolean;
    propertyManagement: boolean;
  };
  data: {
    buildings?: Building[];
    fitness?: PageContent;
    teaRoom?: PageContent;
    cafeteria?: PageContent;
    bar?: PageContent;
    propertyManagement?: PageContent;
  };
}
```

## Service Isolation

Each dorm can override these services in its `services/` folder:

- **Notifications** (`tabu-notifications.ts`) - Browser notification logic, Firestore integration
- **Firestore Service** (`firestore-service.ts`) - Custom collection names, query patterns
- **Admin Access** (`use-admin-access.ts`, `admins.ts`) - Dorm-specific admin lists

Shared components in `src/components/` and `src/app/` use the re-exported services from `src/lib/`, ensuring backward compatibility while allowing per-dorm customization.

## Deployment

### Web (PWA)

- Project name: `dorms-pwa`
- Deploy to Vercel or Firebase Hosting
- Supports browser notifications
- Installable on any device

## Firebase Setup

Each dorm should have:

- Separate Firestore collection (e.g., `tabu2Content`, `newDormContent`)
- Shared authentication (`users` collection)
- Optional per-dorm topics for organization

## Next Steps

1. Create your dorm folder under `src/dorms/`
2. Define config, data, and optional services
3. Register in `src/dorms/registry.ts`
4. Test locally with `npm run dev`
5. Deploy web version with `npm run build`

---

**Ready to expand! 🚀**

Each new dorm is fully isolated and can override any service while sharing the core platform infrastructure.
