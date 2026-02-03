import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { adminAccess } from './admins';

export function useAdminAccess(pageType: keyof typeof adminAccess) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userApartment, setUserApartment] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const apartmentNumber = userData.apartmentNumber || '';
          setUserApartment(apartmentNumber);
          const hasAccess = adminAccess[pageType].includes(apartmentNumber);
          setIsAdmin(hasAccess);
        }
      }
      setLoading(false);
    };

    checkAccess();
  }, [pageType]);

  return { isAdmin, userApartment, loading };
}
