import type { FinalStatistics } from "./FinalStatistics";

export interface StatisticsState {
  syncedError: boolean;
  average: FinalStatistics | null;
}
