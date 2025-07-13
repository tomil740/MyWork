import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import type { AuthUser, User } from '../../models/User';
/*
// Create the persistence handler
const { persistAtom } = recoilPersist({
  key: "authState", // Key to store in local storage
  storage: localStorage, // Default is localStorage; you can also use sessionStorage
});

// Define the Recoil atom with persistence
export const authState = atom<AuthUser | null>({
  key: "authState", // Unique key
  default: null, // Default state: no user authenticated
  effects_UNSTABLE: [persistAtom], // Attach the persistence effect
});
*/
