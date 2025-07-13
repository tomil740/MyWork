import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import type { DailyDeclareDto } from "./dtoModels/DailyDeclareDto";
import { db } from "../firebaseConfig";
import { castToDate } from '../../domain/util/DateUtils';

const dailyDeclariesRef = collection(db, "DailyDeclaries");

export async function getWeekDeclarations( 
  startDate: Date,
  endDate: Date,
  uid: string
): Promise<DailyDeclareDto[]> {
  try {
    const start = Timestamp.fromDate(startDate);
    const end = Timestamp.fromDate(endDate);

    const q = query(
      dailyDeclariesRef,
      orderBy("date", "desc"),
      where("uid", "==", uid),
      where("date", ">=", start),
      where("date", "<=", end)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as DailyDeclareDto);
  } catch (error) {
    console.error("Error fetching week declarations:", error);
    throw new Error("Could not fetch declarations");
  }
}

export async function getDeclarationsUntil(
  untilDate: Date,
  uid: string
): Promise<DailyDeclareDto[]> {
  try {
    const end = Timestamp.fromDate(untilDate);

    console.error(castToDate(end))
    const q = query(
      dailyDeclariesRef,
      orderBy("date", "desc"),
      where("uid", "==", uid),
      where("date", "<=", end)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as DailyDeclareDto);
  } catch (error) {
    console.error("Error fetching week declarations:", error);
    throw new Error("Could not fetch declarations");
  }
}




export async function setDailyDeclaration(declare: DailyDeclareDto): Promise<void> {
  try {
    const docId = `${declare.uid}_${declare.date}`; // ISO date recommended here
    const docRef = doc(dailyDeclariesRef, docId);

    await setDoc(docRef, {
      ...declare,
      date: Timestamp.fromDate(new Date(declare.date)), // Convert from ISO string
    });
  } catch (error) {
    console.error("Error setting declaration:", error);
    throw new Error("Could not save declaration");
  }
}
