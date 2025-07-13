// store/auth/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "../../models/User";
import { cleanArchiveStat} from "../../../data/local/loadArchiveStat";

// Helper function to load from localStorage
const loadAuthFromStorage = (): AuthUser | null => {
  try {
    const data = localStorage.getItem("authState");
    return data ? (JSON.parse(data) as AuthUser) : null;
  } catch {
    return null;
  }
};

// Initial state loaded from localStorage
const initialState: AuthUser | null = loadAuthFromStorage();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<AuthUser>) {
      localStorage.setItem("authState", JSON.stringify(action.payload));
      return action.payload;
    },
    clearAuth() {
      localStorage.removeItem("authState");
      cleanArchiveStat();
      return null;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
