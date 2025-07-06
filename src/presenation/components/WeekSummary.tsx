import React from "react";
import type { WeekStats } from "../../domain/models/WeekStats";
import styles  from "../style/WeekSummary.module.css";

interface Props {
  stats: WeekStats;
}

const WeekSummary: React.FC<Props> = ({ stats }) => {
  const start = new Date(stats.weekStart);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" });

  return (
    <div className={styles.container}>
      <h2 className={styles.rangeTitle}>
        {formatDate(start)} - {formatDate(end)}
      </h2>
      <div className={styles.summaryBox}>
        <div className={styles.statBlock}>
          <div className={styles.statLabel}>Total This Week</div>
          <div className={styles.statValue}>{stats.weekSum}</div>
        </div>
        <div className={styles.statBlock}>
          <div className={styles.statLabel}>Daily Average</div>
          <div className={styles.statValue}>{stats.averagePerDay}</div>
        </div>
      </div>
    </div>
  );
};

export default WeekSummary;
