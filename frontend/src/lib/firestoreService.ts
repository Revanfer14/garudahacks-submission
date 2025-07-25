import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore } from './firebase.js';
import { Dongeng, DongengListItem } from '../app/data/dongengData';

// Function to fetch all dongeng documents from Firestore
export const fetchAllDongengs = async (): Promise<DongengListItem[]> => {
  try {
    const dongengCollection = collection(firestore, 'dongengs');
    const snapshot = await getDocs(dongengCollection);
    
    const dongengs: DongengListItem[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      dongengs.push({
        id: doc.id, // Use Firestore document ID
        title: data.title || '',
        region: data.region || '',
        description: data.description || '',
        category: data.category || '',
      });
    });
    
    return dongengs;
  } catch (error) {
    console.error('Error fetching dongengs:', error);
    return [];
  }
};

// Function to fetch a specific dongeng by ID
export const fetchDongengById = async (id: string): Promise<Dongeng | null> => {
  try {
    const dongengRef = doc(firestore, 'dongengs', id);
    const docSnap = await getDoc(dongengRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        title: data.title || '',
        region: data.region || '',
        category: data.category || '',
        content: data.content || '',
        moral: data.moral || '',
      };
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching dongeng:', error);
    return null;
  }
};

// Function to fetch all dongeng documents as a key-value object (similar to your current dongengData)
export const fetchDongengData = async (): Promise<{ [key: string]: Dongeng }> => {
  try {
    const dongengCollection = collection(firestore, 'dongengs');
    const snapshot = await getDocs(dongengCollection);
    
    const dongengData: { [key: string]: Dongeng } = {};
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      dongengData[doc.id] = {
        title: data.title || '',
        region: data.region || '',
        category: data.category || '',
        content: data.content || '',
        moral: data.moral || '',
      };
    });
    
    return dongengData;
  } catch (error) {
    console.error('Error fetching dongeng data:', error);
    return {};
  }
};
