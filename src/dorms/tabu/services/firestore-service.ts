import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot, DocumentData } from 'firebase/firestore';
import type { PageContent } from '@/lib/types';
import {
  initialFitnessRoomData,
  initialTeaRoomData,
  initialCafeteriaData,
  initialBarData,
  initialPropertyManagementData,
} from '@/lib/data';

const initialDataMap: { [key: string]: PageContent } = {
  fitnessRoom: initialFitnessRoomData,
  teaRoom: initialTeaRoomData,
  tabuCafeteria: initialCafeteriaData,
  tabuBar: initialBarData,
  propertyManagement: initialPropertyManagementData,
};

const collectionName = 'tabu2Content';

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
  
  const unsubscribe = onSnapshot(docRef, async (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as PageContent);
    } else {
      const initialData = initialDataMap[pageId];
      if(initialData) {
        await setDoc(docRef, initialData);
      } else {
        console.error(`No initial data defined for page: ${pageId}`);
      }
    }
  });

  return unsubscribe;
}

export async function updatePageContent(pageId: string, data: PageContent): Promise<void> {
  if (!pageId) {
    throw new Error('A pageId is required to update content.');
  }
  const docRef = doc(db, collectionName, pageId);
  await setDoc(docRef, data, { merge: true });
}
