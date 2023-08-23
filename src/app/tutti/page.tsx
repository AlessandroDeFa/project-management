"use client";
import styles from "./style.module.css";
import ToolBar from "../components/tool-bar";
import Item from "../components/item";
import { AnimatePresence, motion } from "framer-motion";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { resetState } from "@/redux/features/formValues-slice";
import { useEffect, useState } from "react";
import MessageEmpty from "../components/messageEmpty";
import { MemoData, NoteData, ProjectData, TaskData } from "../utils/dataTypes";
import CircularProgress from "../components/circularProgress";
import {
  getCompleted,
  getMemo,
  getNote,
  getProjects,
  getTasks,
} from "../utils/fetchData";
import { CompletedElement } from "../utils/dataTypes";
import {
  updateAllElementsCount,
  updateCompletedCount,
  updateMemoCount,
  updateNoteCount,
  updateProjectsCount,
  updateTaskCount,
} from "@/redux/features/countElements-slice";
import { deletedSelectedElement, moveToCompleted } from "../utils/apiService";
import { elIn } from "../components/item/anim";

export default function Tutti() {
  const [refreshElements, setRefreshElements] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingItems, setIsLoadingItems] = useState<boolean>(true);
  const [isWaiting, setIsWaiting] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [notes, setNote] = useState<NoteData[]>([]);
  const [completed, setCompleted] = useState<CompletedElement[]>([]);
  const [memos, setMemo] = useState<MemoData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);

  const countElements = useAppSelector(
    (state) => state.countElementsReducer.value.countAllElements
  );

  const allArraysEmpty =
    tasks.length === 0 &&
    notes.length === 0 &&
    completed.length === 0 &&
    memos.length === 0 &&
    projects.length === 0;

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(resetState());
    const fetchTasks = async () => {
      try {
        setIsLoadingItems(true);
        const promises = [
          { stateSetter: setTasks, promise: getTasks() },
          { stateSetter: setNote, promise: getNote() },
          { stateSetter: setCompleted, promise: getCompleted() },
          { stateSetter: setMemo, promise: getMemo() },
          { stateSetter: setProjects, promise: getProjects() },
        ];

        const settledResults = await Promise.allSettled(
          promises.map((p) => p.promise)
        );

        let totalCount = 0;

        settledResults.forEach((result, index) => {
          const { stateSetter } = promises[index];
          if (result.status === "fulfilled") {
            stateSetter(result.value);
            const arrayLength = result.value.length;
            totalCount += arrayLength;
          }
        });

        dispatch(updateAllElementsCount(totalCount));
        setIsLoadingItems(false);
      } catch (error) {
        setIsLoadingItems(false);
        console.error(error);
      }
    };

    fetchTasks();
  }, [refreshElements]);

  const deleteCompletedElement = async (id: string) => {
    try {
      setIsLoading(true);
      await deletedSelectedElement(id);
      setCompleted(completed.filter((item) => item.id !== id));
      setIsLoading(false);
      dispatch(updateCompletedCount(completed.length - 1));
      dispatch(updateAllElementsCount(countElements - 1));
    } catch (error) {
      console.error("Errore durante l'eliminazione:", error);
    }
    setIsLoading(false);
  };

  const moveToCompletedElements = (id: string, elementType: string) => {
    if (!isWaiting) {
      setIsWaiting(true);
      const idtimeout = setTimeout(async () => {
        try {
          setIsLoading(true);
          const res = await moveToCompleted(id, elementType);
          switch (elementType) {
            case "Incarico":
              setTasks(tasks.filter((item) => item.id !== id));
              dispatch(updateTaskCount(tasks.length - 1));
              break;
            case "Appunti":
              setNote(notes.filter((item) => item.id !== id));
              dispatch(updateNoteCount(notes.length - 1));
              break;
            case "Promemoria":
              setMemo(memos.filter((item) => item.id !== id));
              dispatch(updateMemoCount(memos.length - 1));
              break;
            case "Progetto":
              setProjects(projects.filter((item) => item.id !== id));
              dispatch(updateProjectsCount(projects.length - 1));
              break;
          }

          setIsLoading(false);
          dispatch(updateCompletedCount(completed.length + 1));
          setRefreshElements(!refreshElements);
          return res;
        } catch (error) {
          console.error(
            "Errore durante la completazione dell' elemento:",
            error
          );
        }
        setIsWaiting(false);
        setIsLoading(false);
        setTimeoutId(null);
      }, 1250);
      setTimeoutId(idtimeout);
    } else {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      setIsWaiting(false);
    }
  };

  return (
    <main>
      <ToolBar disabledAddButton={true} />
      <div className={styles.container}>
        <div className={styles.flex}>
          <h1 className={styles.title}>Tutti</h1>
          {isLoading && (
            <CircularProgress
              size={{
                width: 13,
                height: 13,
              }}
            />
          )}
          <span>{countElements}</span>
        </div>

        <div
          className={`${styles.wrapperElements} ${
            isLoadingItems && allArraysEmpty && styles.circularProgress
          }`}
        >
          {isLoadingItems && allArraysEmpty && (
            <CircularProgress size={{ width: 20, height: 20 }} />
          )}
          <AnimatePresence initial={false}>
            {tasks.length !== 0 && (
              <motion.div
                key={"Tasks"}
                variants={elIn}
                initial="initial"
                animate="enter"
                exit="exit"
                className={styles.borderOneCategory}
              >
                <div className={styles.containerOneCategory}>
                  <p
                    className={`${styles.titleOneCategory} ${styles.titleTask}`}
                  >
                    Incarichi
                  </p>
                  <AnimatePresence initial={false}>
                    {tasks.map((task) => (
                      <Item
                        key={task.id}
                        data={task}
                        handleClick={() =>
                          moveToCompletedElements(task.id, "Incarico")
                        }
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {notes.length !== 0 && (
              <motion.div
                key={"Notes"}
                variants={elIn}
                initial="initial"
                animate="enter"
                exit="exit"
                className={styles.borderOneCategory}
              >
                <div className={styles.containerOneCategory}>
                  <p
                    className={`${styles.titleOneCategory} ${styles.titleNote}`}
                  >
                    Appunti
                  </p>
                  <AnimatePresence initial={false}>
                    {notes.map((note) => (
                      <Item
                        key={note.id}
                        data={note}
                        handleClick={() =>
                          moveToCompletedElements(note.id, "Appunti")
                        }
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {completed.length !== 0 && (
              <motion.div
                key={"Completed"}
                variants={elIn}
                initial="initial"
                animate="enter"
                exit="exit"
                className={styles.borderOneCategory}
              >
                <div className={styles.containerOneCategory}>
                  <p
                    className={`${styles.titleOneCategory} ${styles.titleCompleted}`}
                  >
                    Completati
                  </p>
                  <AnimatePresence initial={false}>
                    {completed.map((el) => (
                      <Item
                        key={el.id}
                        data={el}
                        handleClick={() => deleteCompletedElement(el.id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {memos.length !== 0 && (
              <motion.div
                key={"Memo"}
                variants={elIn}
                initial="initial"
                animate="enter"
                exit="exit"
                className={styles.borderOneCategory}
              >
                <div className={styles.containerOneCategory}>
                  <p
                    className={`${styles.titleOneCategory} ${styles.titleMemo}`}
                  >
                    Promemoria
                  </p>
                  <AnimatePresence initial={false}>
                    {memos.map((memo) => (
                      <Item
                        key={memo.id}
                        data={memo}
                        handleClick={() =>
                          moveToCompletedElements(memo.id, "Promemoria")
                        }
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {projects.length !== 0 && (
              <motion.div
                key={"Projects"}
                variants={elIn}
                initial="initial"
                animate="enter"
                exit="exit"
                className={styles.borderOneCategory}
              >
                <div className={styles.containerOneCategory}>
                  <p
                    className={`${styles.titleOneCategory} ${styles.titleProject}`}
                  >
                    Progetti
                  </p>
                  <AnimatePresence initial={false}>
                    {projects.map((project) => (
                      <Item
                        key={project.id}
                        data={project}
                        handleClick={() =>
                          moveToCompletedElements(project.id, "Progetto")
                        }
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {!isLoadingItems && allArraysEmpty && (
            <MessageEmpty message="Non ci sono elementi" />
          )}
        </div>
      </div>
    </main>
  );
}
