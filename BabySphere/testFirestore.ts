import { collection, getDocs } from 'firebase/firestore';
import { db } from './config/firebaseConfig'; // Make sure the path is correct

(async () => {
  try {
    // Attempt to fetch all documents from the 'sensor_data' collection
    const snapshot = await getDocs(collection(db, 'sensor_data'));

    // Check if the collection has no documents
    if (snapshot.empty) {
      console.log('No documents found in sensor_data collection.');
    } else {
      snapshot.forEach((doc) => {
        // For each document, log its ID and data
        console.log(doc.id, '=>', doc.data());
      });
    }
  } catch (error) {
    // If there is any error fetching data, log it
    console.error('Firestore test error:', error);
  }
})();
