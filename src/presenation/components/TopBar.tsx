import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserHeader from "./UserHeader";
import "../style/TopBar.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../data/firebaseConfig";
import type { User } from "../../domain/models/User";
import type { RootState } from "../../domain/states/Store";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth, setAuth } from "../../domain/states/AuthState/AuthSlice";

const TopBar = () => {
  const navigate = useNavigate();
  const authUser = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleNavigation = (path: string) => {
    try {
      navigate(path);
    } catch (err) {
      console.error("Navigation error:", err);
      alert("Navigation unavailable.");
    }
  };

  useEffect(() => {
    const syncUserIfNeeded = async () => {
      if (!authUser || !authUser.uid) return;

      const syncThreshold = 24 * 60 * 60 * 1000; // One day in milliseconds
      const lastSynced = authUser.syncedAt || 0;
      const timeSinceLastSync = Date.now() - lastSynced;

      if (timeSinceLastSync < syncThreshold) {
        console.log("No sync required, within sync threshold.");
        return;
      }

      try {
        console.log("Syncing user data from Firestore...");
        const userDoc = await getDoc(doc(db, "users", authUser.uid));

        if (userDoc.exists()) {
          const updatedUserData = userDoc.data() as User;
          dispatch(setAuth({
            ...updatedUserData,
            syncedAt: Date.now(), // Update sync timestamp
          }));
          console.log("User synced successfully.");
        } else {
          console.warn("User not found in Firestore.");
        }
      } catch (err) {
        console.error("Failed to sync user data:", err);
      }
    };

    syncUserIfNeeded();
  }, [authUser]);

  return (
    <div className="top-bar">
      {!authUser ? (
        <div className="guest-presentation">
          <span className="guest-message">היי אורח</span>

          <button
            className="nav-button styled-button login-guest-button"
            onClick={() => handleNavigation("/login")}
          >
            🔐 התחבר כדי לצפות בנתונים שלך
          </button>
        </div>
      ) : (
        <>
          <UserHeader
            userId={authUser.uid}
            onLogout={() => dispatch(clearAuth())}
          />
        </>
      )}
    </div>
  );
};

export default TopBar;

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  floatingLab?: number;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onClick,
  floatingLab,
}) => {
  return (
    <div className="action-button-wrapper" onClick={onClick}>
      <div className="action-button-frame">
        <div className="action-button-icon">{icon}</div>
        {floatingLab !== undefined && (
          <div className="floating-badge">{floatingLab}</div>
        )}
      </div>
      <span className="action-button-label">{label}</span>
    </div>
  );
};
