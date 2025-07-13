import { useState } from "react";
import  type { User } from '../models/User';
import { loginUser, registerUser, logoutUser } from "../../data/remote/AuthDao";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../states/Store";
import { clearAuth, setAuth } from "../states/AuthState/AuthSlice";


const useAuth = () => { 
  const user = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const userData = await loginUser(email, password);
      if (userData) {
        dispatch(setAuth({ ...userData, syncedAt: Date.now() }));
        return true;
      } else {
        setError("User not found");
        return false;
      }
    } catch (err: any) {
      setError(err.message);
      dispatch(clearAuth());
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
  ) => {
    setLoading(true);
    setError(null);
    const newUser: User = {
      name,
      uid: "",
      theUid : ""
    };
    try {
      const registeredUser = await registerUser(email, password, newUser);
      dispatch(setAuth(registeredUser));
    } catch (err: any) {
      setError(err.message);
      dispatch(clearAuth());
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await logoutUser();
      dispatch(clearAuth());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, login, register, logout };
};

export default useAuth;
