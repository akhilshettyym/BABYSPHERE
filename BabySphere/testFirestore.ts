import { collection, getDocs } from "firebase/firestore";
import { db } from "./config/firebaseConfig";

const fetchSensorData = async () => {
  try {

    const snapshot = await getDocs(collection(db, "sensor_data"));

    if (snapshot.empty) {
      console.log("No documents found in sensor_data collection.");
    } else {
      snapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
      });
    }
  } catch (error) {
    console.error("Firestore test error:", error);
  }
};

fetchSensorData();