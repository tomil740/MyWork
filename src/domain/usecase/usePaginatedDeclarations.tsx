import { useState, useCallback } from "react";
import type { DailyDeclare } from "../models/DailyDeclare";
import { getWeekDeclarations } from "../../data/remote/DeclariesRemoteDao";
import { FIXED_UID } from "../../data/firebaseConfig";
import type { WeeksRange } from "../models/WeeksRange";

export function usePaginatedDeclarations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadNextPage = useCallback(
    async (range: WeeksRange) => { 
      const { start, end } = range;

      if (loading || !hasMore) {
        if(!hasMore){
         // setError(Error("End of data"))
        }
      
        return null; 
      }
      setLoading(true);
      setError(null);

      try {
        const result = await getWeekDeclarations(start, end, FIXED_UID);
        console.log("fetched r",result)
        //if (result.length === 0) 
        return result
      } catch (e) {
        setError(e as Error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore]
  );

  return {
    loading,
    error,
    hasMore,
    loadNextPage,
  };
}
