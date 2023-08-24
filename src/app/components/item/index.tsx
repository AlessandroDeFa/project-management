"use client";
import { usePathname } from "next/navigation";
import styles from "./style.module.css";
import { motion } from "framer-motion";
import { elIn } from "./anim";
import { AllElements } from "@/app/utils/dataTypes";
import { useState } from "react";
import { moveToCompleted } from "@/app/utils/apiService";
import { updateTaskCount } from "@/redux/features/countElements-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

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
  isLoading: boolean;
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
  const [isWaiting, setIsWaiting] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [lastClickedId, setLastClickedId] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();

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
