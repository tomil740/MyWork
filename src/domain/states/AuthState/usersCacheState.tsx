import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import type { User } from "../../models/User";

// Create the persistence handler
const { persistAtom } = recoilPersist({
  key: "usersCacheState", // Key to store in local storage
  storage: localStorage, // Default is localStorage; you can also use sessionStorage
});

interface CachedUser {
  data: User;
  syncedAt: number;
}

export const usersCacheState = atom<Record<string, CachedUser>>({
  key: "usersCacheState",
  default: {},
  effects_UNSTABLE: [persistAtom],
});
