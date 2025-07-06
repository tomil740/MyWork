import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import styles from "../style/DailyPresentation.module.css";
import type { DailyDeclare } from "../../domain/models/DailyDeclare";


interface Props {
  daily: DailyDeclare;
  onUpdate: (updatedDaily: DailyDeclare) => void;
  editable?: boolean;
}

const amountOptions = [1, 2, 3, 4, 5, 6,7,8,9,10,11].map((v) => ({
  value: v,
  label: v.toString(),
}));

const DailyPresentation: React.FC<Props> = ({
  daily,
  onUpdate,
  editable = true,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [localDaily, setLocalDaily] = useState(daily);

  const toggleEdit = () => {
    if (isEdit){
      if(localDaily!=daily){
        onUpdate(localDaily)
      }

    };
    setIsEdit((prev) => !prev);
  };

  const handleChange = (key: "general" | "work", value: number) => {
    const rounded = parseFloat(value.toFixed(2));
    setLocalDaily((prev) => ({ ...prev, [key]: rounded }));
  };
  const increase = (key: "general" | "work") =>
    handleChange(key, localDaily[key] + 0.1);

  const decrease = (key: "general" | "work") =>
    handleChange(key, Math.max(localDaily[key] - 0.1, 0));

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const weekday = d.toLocaleDateString("en-GB", { weekday: "long" }); // full day name
    const date = d.toLocaleDateString("en-GB"); // dd/mm/yyyy
    return `${weekday} ${date}`;
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isEdit) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsEdit(false);
        setLocalDaily(daily)
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEdit, localDaily, onUpdate]);

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${isEdit ? styles.editMode : ""}`}
    >
      {editable && (
        <div className={styles.toggleEdit} onClick={toggleEdit}>
          {isEdit ? "💾" : "✏️"}
        </div>
      )}
      <h3 className={styles.dateHeader}>{formatDate(daily.date)}</h3>

      <div className={styles.fieldsRow}>
        {["general", "work"].map((key) => {
          const value = localDaily[key as "general" | "work"];
          return (
            <div className={styles.fieldBox} key={key}>
              <div className={styles.fieldLabel}>{key}</div>
              {isEdit ? (
                <div className={styles.amountPicker}>
                  <button onClick={() => decrease(key as "general" | "work")}>
                    -
                  </button>
                  <Select
                    options={amountOptions}
                    value={{ value, label: value.toString() }}
                    onChange={(selected) =>
                      handleChange(
                        key as "general" | "work",
                        selected?.value || 0
                      )
                    }
                    classNamePrefix="amount-picker"
                  />
                  <button onClick={() => increase(key as "general" | "work")}>
                    +
                  </button>
                </div>
              ) : (
                <div className={styles.fieldValue}>{value}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyPresentation;
