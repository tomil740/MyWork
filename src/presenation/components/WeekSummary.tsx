import React from "react";
import type { WeekStats } from "../../domain/models/WeekStats";
import styles from "../style/WeekSummary.module.css";
import { Link } from "react-router-dom";
import { addDays } from "date-fns";

interface Props {
  stats: WeekStats;
  isHeader?: boolean;
}

const WeekSummary: React.FC<Props> = ({ stats, isHeader }) => {
  const start = new Date(stats.weekStart);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" });

  const theHeader = !isHeader
    ? `${formatDate(start)} - ${formatDate(end)}`
    : "All time statistics :";

  const totalHeader = !isHeader ? "Total This Week" : "Average work day :";

  const averageHeader = !isHeader ? "Daily Average" : "Average week,total :"; //"Average day,total :";

  const theLink = !isHeader
    ? `/LiveView/${addDays(start, 1).toISOString()}`
    : "";

  return (
    <Link to={theLink} style={{ display: "block", height: "100%" }}>
      <div
        className={`${styles.container} ${isHeader ? styles.headerStyle : ""}`}
      >
        <h2 className={styles.rangeTitle}>{theHeader}</h2>
        <div className={styles.summaryBox}>
          <div className={styles.statBlock}>
            <div className={styles.statLabel}>{totalHeader}</div>
            <div className={styles.statValue}>{stats.weekSum}</div>
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statLabel}>{averageHeader}</div>
            <div className={styles.statValue}>{stats.averagePerDay}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WeekSummary;
