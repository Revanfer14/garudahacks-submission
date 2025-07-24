import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../lib/firebase.js';
import { dongengData, dongengList } from './dongengData';

// Function to upload static data to Firestore
export const uploadStaticDataToFirestore = async () => {
  try {
    console.log('Starting upload to Firestore...');
    
    // Upload dongeng data using the same IDs as keys
    for (const [id, dongeng] of Object.entries(dongengData)) {
      // Find corresponding list item for description
      const listItem = dongengList.find(item => item.id === id);
      
      const dongengToUpload = {
        title: dongeng.title,
        region: dongeng.region,
        category: dongeng.category,
        content: dongeng.content,
        moral: dongeng.moral,
        description: listItem?.description || '', // Add description from list
      };

      // Use setDoc with the specific ID instead of addDoc for auto-generated ID
      await setDoc(doc(firestore, 'dongengs', id), dongengToUpload);
      console.log(`Uploaded dongeng with ID: ${id}`);
    }
    
    console.log('Successfully uploaded all dongeng data to Firestore!');
    return true;
  } catch (error) {
    console.error('Error uploading data to Firestore:', error);
    return false;
  }
};

// Function to run the upload (you can call this manually)
export const runUpload = async (): Promise<boolean> => {
  const result = await uploadStaticDataToFirestore();
  return result;
};
