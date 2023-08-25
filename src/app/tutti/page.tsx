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
import ErrorDialog from "../components/errorMessage";

export default function Tutti() {
  const [refreshElements, setRefreshElements] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingItems, setIsLoadingItems] = useState<boolean>(true);
  const [isWaiting, setIsWaiting] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [errorDialog, setErrorDialog] = useState<boolean>(false);
  const [lastClickedId, setLastClickedId] = useState<string | null>(null);
  const [shouldUpdateCount, setShouldUpdateCount] = useState(false);

  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [notes, setNote] = useState<NoteData[]>([]);
  const [completed, setCompleted] = useState<CompletedElement[]>([]);
  const [memos, setMemo] = useState<MemoData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);

  const { countAllElements } = useAppSelector(
    (state) => state.countElementsReducer.value
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

        if (settledResults.some((result) => result.status === "rejected")) {
          setErrorDialog(true);
        }

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
        setErrorDialog(true);
      }
    };

    fetchTasks();
    //eslint-disable-next-line
  }, [refreshElements]);

  const deleteCompletedElement = async (id: string) => {
    if (isLoading) {
      return;
    }
    try {
      setIsLoading(true);
      await deletedSelectedElement(id);
      setCompleted(completed.filter((item) => item.id !== id));
      setIsLoading(false);
      dispatch(updateCompletedCount(completed.length - 1));
      dispatch(updateAllElementsCount(countAllElements - 1));
    } catch (error) {
      console.error("Errore durante l'eliminazione:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (shouldUpdateCount) {
      dispatch(updateCompletedCount(completed.length));
      dispatch(updateTaskCount(tasks.length));
      dispatch(updateNoteCount(notes.length));
      dispatch(updateMemoCount(memos.length));
      dispatch(updateProjectsCount(projects.length));
    }
    //eslint-disable-next-line
  }, [tasks, notes, memos, projects]);

  const moveToCompletedElements = (id: string, elementType: string) => {
    if (isLoading) {
      return;
    }
    if (!isWaiting || id !== lastClickedId) {
      setIsWaiting(true);
      setLastClickedId(id);

      const idtimeout = setTimeout(async () => {
        try {
          setIsLoading(true);
          await moveToCompleted(id, elementType);
          switch (elementType) {
            case "Incarico":
              setTasks((prevData) => prevData.filter((item) => item.id !== id));
              break;
            case "Appunti":
              setNote((prevData) => prevData.filter((item) => item.id !== id));
              break;
            case "Promemoria":
              setMemo((prevData) => prevData.filter((item) => item.id !== id));
              break;
            case "Progetto":
              setProjects((prevData) =>
                prevData.filter((item) => item.id !== id)
              );
              break;
          }
          setRefreshElements(!refreshElements);
        } catch (error) {
          console.error(
            "Errore durante la completazione dell' elemento:",
            error
          );
        }
        setShouldUpdateCount(true);

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
          <span>{countAllElements}</span>
        </div>

        <div
          className={`${styles.wrapperElements} ${
            isLoadingItems && allArraysEmpty && styles.circularProgress
          }`}
        >
          <ErrorDialog setOpen={setErrorDialog} open={errorDialog} />

          {isLoadingItems && allArraysEmpty && (
            <CircularProgress size={{ width: 20, height: 20 }} />
          )}
          <AnimatePresence>
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
                        isLoading={isLoading}
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
                        isLoading={isLoading}
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
                        isLoading={isLoading}
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
                        isLoading={isLoading}
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
