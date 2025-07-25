import { dongengList as staticDongengList, dongengData as staticDongengData } from './dongengData';
import { fetchAllDongengs, fetchDongengData } from '../../lib/firestoreService';
import { DongengListItem, Dongeng } from './dongengData';

// Hybrid function that combines static and Firestore data
export const getDongengList = async (): Promise<DongengListItem[]> => {
  try {
    // Try to fetch from Firestore first
    const firestoreData = await fetchAllDongengs();
    
    // If Firestore has data, use it; otherwise fall back to static data
    if (firestoreData.length > 0) {
      return firestoreData;
    } else {
      return staticDongengList;
    }
  } catch (error) {
    console.error('Error fetching dongeng list, falling back to static data:', error);
    return staticDongengList;
  }
};

// Hybrid function for dongeng data object
export const getDongengData = async (): Promise<{ [key: string]: Dongeng }> => {
  try {
    // Try to fetch from Firestore first
    const firestoreData = await fetchDongengData();
    
    // If Firestore has data, use it; otherwise fall back to static data
    if (Object.keys(firestoreData).length > 0) {
      return firestoreData;
    } else {
      return staticDongengData;
    }
  } catch (error) {
    console.error('Error fetching dongeng data, falling back to static data:', error);
    return staticDongengData;
  }
};

// Function to get a single dongeng by ID (hybrid approach)
export const getDongengById = async (id: string): Promise<Dongeng | null> => {
  try {
    // First try to get all data (this will cache it)
    const allData = await getDongengData();
    return allData[id] || null;
  } catch (error) {
    console.error('Error fetching dongeng by ID:', error);
    return null;
  }
};
