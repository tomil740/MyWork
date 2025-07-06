import { useState, useCallback } from "react";
import { setDailyDeclaration } from "../../data/remote/DeclariesRemoteDao";
import type { DailyDeclare } from "../models/DailyDeclare";
import { FIXED_UID } from "../../data/firebaseConfig";

export function useUpsertDeclare() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const upsertDeclare = useCallback(async (declare: DailyDeclare) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await setDailyDeclaration({
        ...declare,
        uid: FIXED_UID,
      });
      setSuccess(true);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    upsertDeclare,
    loading,
    error,
    success,
  };
}
