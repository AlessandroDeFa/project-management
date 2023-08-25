"use client";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import styles from "./style.module.css";
import { Dropdown } from "../dropdown";
import { formIn } from "./anim";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import {
  updateDuedate,
  updateIsCompleted,
  updateName,
  updateNote,
} from "@/redux/features/formValues-slice";
import { useEffect, useState } from "react";
import { getProjects } from "@/app/utils/fetchData";
import { ProjectData } from "@/app/utils/dataTypes";
import CircularProgress from "../circularProgress";

interface ClassMap {
  incarichi: string;
  appunti: string;
  progetti: string;
  promemoria: string;
}

interface FormItemProps {
  isLoading?: boolean;
}

export default function FormItem({ isLoading }: FormItemProps) {
  const currentPage = usePathname()!.substring(1) || "incarichi";
  const [data, setData] = useState<ProjectData[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(false);

  const classMap: ClassMap = {
    incarichi: styles.incarichi,
    appunti: styles.appunti,
    progetti: styles.progetti,
    promemoria: styles.promemoria,
  };

  const dynamicClass = classMap[currentPage as keyof ClassMap] || "";
  const isCompleted = useAppSelector(
    (state) => state.formValuesReducer.value.isCompleted
  );
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedCurrentDate = `${year}-${month}-${day}`;

  const dispatch = useDispatch<AppDispatch>();
  const dropmenuVisible =
    currentPage !== "progetti" && currentPage !== "promemoria";
  const datepicker = currentPage === "promemoria";

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        dispatch(updateDuedate(formattedCurrentDate));
        setIsLoadingProjects(true);

        let projectData;
        await Promise.allSettled([
          (projectData = await getProjects()),
          new Promise((resolve) => setTimeout(resolve, 300)),
        ]);

        setData(projectData);
        setIsLoadingProjects(false);
      } catch (error) {
        setIsLoadingProjects(false);
        console.error(error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div
      style={{
        overflow: "hidden",
      }}
    >
      <motion.div
        variants={formIn}
        initial="initial"
        animate="enter"
        exit="exit"
        className={styles.wrapper}
      >
        <div>
          <input
            type="radio"
            name="isCompleted"
            checked={isCompleted}
            onClick={() => dispatch(updateIsCompleted())}
            onChange={() => {}}
            className={`${styles.radio} ${dynamicClass}`}
          />
        </div>
        <div className={styles.containerInfo}>
          <div className={styles.wrapperInfo}>
            <input
              type="text"
              placeholder="Nome"
              onChange={(e) => dispatch(updateName(e.target.value))}
            />
            <input
              type="text"
              placeholder="Note"
              onChange={(e) => dispatch(updateNote(e.target.value))}
            />
            {datepicker && (
              <input
                min={formattedCurrentDate}
                className={styles.datepicker}
                type="date"
                defaultValue={formattedCurrentDate}
                onChange={(e) => dispatch(updateDuedate(e.target.value))}
              />
            )}

            {dropmenuVisible && (
              <Dropdown data={data} isLoading={isLoadingProjects} />
            )}
          </div>
          {isLoading && <CircularProgress size={{ width: 13, height: 13 }} />}
        </div>
      </motion.div>
    </div>
  );
}
