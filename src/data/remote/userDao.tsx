import { doc, getDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import type { User } from "../../domain/models/User";

export const fetchUserById = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "Failed to fetch user"
    );
  }
};

// Fetches distributer users from Firestore
export const fetchDistributers = async () => {
  try {
    const usersRef = collection(db, "users"); // Reference to the "users" collection
    const distributersQuery = query(
      usersRef,
      where("isDistributer", "==", true)
    ); // Query for distributers
    const snapshot = await getDocs(distributersQuery); // Execute the query

    // Map Firestore documents to an array of distributer objects
    const distributers = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      imageUrl: doc.data().imageUrl,
    }));

    return distributers; // Return the list of distributers
  } catch (error) {
    console.error("Error fetching distributers:", error);
    throw new Error("Failed to fetch distributers.");
  }
};
