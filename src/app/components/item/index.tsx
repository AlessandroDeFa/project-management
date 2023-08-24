"use client";
import { usePathname } from "next/navigation";
import styles from "./style.module.css";
import { motion } from "framer-motion";
import { elIn } from "./anim";
import { AllElements } from "@/app/utils/dataTypes";
import { useState } from "react";

interface ClassMap {
  incarichi: string;
  completati: string;
  appunti: string;
  tutti: string;
  progetti: string;
  promemoria: string;
  search: string;
}

interface ItemProps {
  handleClick?: () => void;
  data: AllElements;
  isLoading?: boolean;
}

export default function Item({ data, handleClick, isLoading }: ItemProps) {
  const currentPage = usePathname()!.substring(1) || "incarichi";
  const {
    name,
    note,
    projectFor,
    elementType,
    DateCompleted,
    dueDate,
    isCompleted,
  } = data;
  const [completeEl, setCompleteEl] = useState<boolean>(false);

  const classMap: ClassMap = {
    incarichi: styles.incarichi,
    completati: styles.completati,
    tutti: styles.tutti,
    appunti: styles.appunti,
    progetti: styles.progetti,
    promemoria: styles.promemoria,
    search: styles.search,
  };

  const dynamicClass = classMap[currentPage as keyof ClassMap] || "";

  const formattedDueDate = dueDate && new Date(dueDate);
  const currentDate = new Date();
  const formattedDueDateWithoutTime = formattedDueDate
    ? new Date(
        formattedDueDate.getFullYear(),
        formattedDueDate.getMonth(),
        formattedDueDate.getDate()
      )
    : null;
  const currentDateWithoutTime = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const isExpired =
    formattedDueDateWithoutTime &&
    currentDateWithoutTime > formattedDueDateWithoutTime;

  const handleMoveToCompleted = () => {
    if (isLoading) {
      return;
    }
    if (handleClick) {
      setCompleteEl(!completeEl);
      handleClick();
    }
  };

  return (
    <motion.div
      variants={elIn}
      initial="initial"
      animate="enter"
      exit="exit"
      className={styles.wrapper}
    >
      <div>
        <input
          type="radio"
          checked={isCompleted ? isCompleted : completeEl}
          onClick={handleMoveToCompleted}
          onChange={() => {}}
          className={`${styles.radio} ${dynamicClass}`}
        />
      </div>
      <div className={styles.containerInfo}>
        <div className={styles.wrapperInfo}>
          <p>{name}</p>
          <p>{note}</p>
          {projectFor && <p>{projectFor}</p>}
          {dueDate && !isExpired && <p>Scade il: {dueDate}</p>}
          {isExpired && (
            <p className={styles.expiredDate}>Scaduto il: {dueDate}</p>
          )}
          {elementType && (
            <p>
              {elementType} &bull; Completato:{" "}
              {DateCompleted && DateCompleted.split("T")[0]}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
