import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot, DocumentData } from 'firebase/firestore';
import type { PageContent } from '@/lib/types';
import {
  pariserFitnessRoom,
  pariserTeaRoom,
  pariserCafeteria,
  pariserBar,
  pariserPropertyManagement,
  pariserNetworkMentor,
} from '../data';

const initialDataMap: { [key: string]: PageContent } = {
  fitnessRoom: pariserFitnessRoom,
  teaRoom: pariserTeaRoom,
  cafeteria: pariserCafeteria,
  bar: pariserBar,
  propertyManagement: pariserPropertyManagement,
  networkMentor: pariserNetworkMentor,
};

// Pariser Straße uses its own Firestore collection
const collectionName = 'pariserContent';

export async function getPageContent(pageId: string): Promise<PageContent> {
  const docRef = doc(db, collectionName, pageId);
  let docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    const initialData = initialDataMap[pageId];
    if (initialData) {
      await setDoc(docRef, initialData);
      docSnap = await getDoc(docRef);
    } else {
      throw new Error(`No initial data defined for page: ${pageId}`);
    }
  }
  
  return docSnap.data() as PageContent;
}

export function subscribeToPageContent(pageId: string, callback: (data: PageContent) => void) {
  const docRef = doc(db, collectionName, pageId);
  
  return onSnapshot(docRef, async (snapshot) => {
    if (!snapshot.exists()) {
      const initialData = initialDataMap[pageId];
      if (initialData) {
        await setDoc(docRef, initialData);
        callback(initialData);
      }
    } else {
      callback(snapshot.data() as PageContent);
    }
  });
}

export async function updatePageContent(pageId: string, data: PageContent): Promise<void> {
  const docRef = doc(db, collectionName, pageId);
  await setDoc(docRef, data);
}
