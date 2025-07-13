import {
  collection,
  query,
  orderBy,
  startAfter,
  getDocs,
  DocumentSnapshot,
} from "firebase/firestore";
import type { DailyDeclare } from "../../models/DailyDeclare";
import { db } from "../../../data/firebaseConfig";


export async function getDailyDeclarePage(
  lastVisible?: DocumentSnapshot
): Promise<{
  items: DailyDeclare[];
  lastVisible?: DocumentSnapshot;
}> {
  try {
    let q = query(
      collection(db, "DailyDeclaries"),
      orderBy("date", "desc"),
    );

    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }

    const snapshot = await getDocs(q);
    const items: DailyDeclare[] = snapshot.docs.map((doc) => ({
      ...doc.data(),
    })) as DailyDeclare[];
    console.log("so fat", items);

    const newLastVisible = snapshot.docs[snapshot.docs.length - 1];

    return {
      items,
      lastVisible: newLastVisible,
    };
  } catch (e) {
    console.error("Failed to fetch declarations:", e);
    throw e;
  }
}
