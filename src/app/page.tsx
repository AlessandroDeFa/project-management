"use client";
import FormItem from "./components/formItem";
import Item from "./components/item";
import ToolBar from "./components/tool-bar";
import styles from "./page.module.css";
import { AnimatePresence } from "framer-motion";
import { useToggleForm } from "./utils/useToggleForm";
import { AppDispatch, useAppSelector } from "@/redux/store";
import {
  moveToCompleted,
  submitCompleted,
  submitTask,
} from "./utils/apiService";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { resetState } from "@/redux/features/formValues-slice";
import { TaskData } from "./utils/dataTypes";
import { getTasks } from "./utils/fetchData";
import CircularProgress from "./components/circularProgress";
import MessageEmpty from "./components/messageEmpty";
import {
  updateAllElementsCount,
  updateCompletedCount,
  updateTaskCount,
} from "@/redux/features/countElements-slice";
import ErrorDialog from "./components/errorMessage";
import scrollToForm from "./utils/scrollToForm";

export default function Home() {
  const [formSubmit, setFormSubmit] = useState<boolean>(false);
  const [formIsOpen, openForm, closeForm] = useToggleForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingItems, setIsLoadingItems] = useState<boolean>(true);
  const [errorDialog, setErrorDialog] = useState<boolean>(false);
  const [lastClickedId, setLastClickedId] = useState<string | null>(null);
  const [shouldUpdateCount, setShouldUpdateCount] = useState(false);

  const [isWaiting, setIsWaiting] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const [data, setData] = useState<TaskData[]>([]);

  const { name, note, projectFor, isCompleted } = useAppSelector(
    (state) => state.formValuesReducer.value
  );
  const { countCompleted, countAllElements } = useAppSelector(
    (state) => state.countElementsReducer.value
  );

  const formRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(resetState());
    const fetchTasks = async () => {
      try {
        setIsLoadingItems(true);
        const tasksData = await getTasks();
        setData(tasksData);
        dispatch(updateTaskCount(tasksData.length));
        setIsLoadingItems(false);
      } catch (error) {
        setIsLoadingItems(false);
        console.error(error);
        setErrorDialog(true);
      }
    };

    fetchTasks();
    //eslint-disable-next-line
  }, [formSubmit]);

  const onSubmit = async (event: React.MouseEvent) => {
    const formValid =
      name !== "" && note !== "" && projectFor !== "" && projectFor != null;
    const clickedElement = event.target as HTMLElement;
    const formWrapper = formRef.current;
    const clickableAttribute = clickedElement.getAttribute("data-clickable");
    if (
      (formWrapper && formWrapper.contains(clickedElement)) ||
      clickableAttribute === "true"
    )
      return;
    if (formValid) {
      setIsLoading(true);
      try {
        let res;
        if (isCompleted) {
          [res] = await Promise.allSettled([
            submitCompleted({
              name: name,
              note: note,
              projectFor: projectFor,
              isCompleted: isCompleted,
              elementType: "Incarico",
            }),
            new Promise((resolve) => setTimeout(resolve, 300)),
          ]);
          dispatch(updateCompletedCount(countCompleted + 1));
        } else {
          [res] = await Promise.allSettled([
            submitTask({
              name: name,
              note: note,
              projectFor: projectFor,
              isCompleted: isCompleted,
            }),
            new Promise((resolve) => setTimeout(resolve, 300)),
          ]);
        }

        dispatch(updateAllElementsCount(countAllElements + 1));

        setIsLoading(false);
        closeForm();
        dispatch(resetState());
        setFormSubmit(!formSubmit);
      } catch (error) {
        console.error("Errore durante la creazione del task:", error);
        setIsLoading(false);
      }
    } else {
      closeForm();
      dispatch(resetState());
    }
  };

  useEffect(() => {
    if (shouldUpdateCount) {
      dispatch(updateTaskCount(data.length));
      setShouldUpdateCount(false);
    }
    //eslint-disable-next-line
  }, [data, shouldUpdateCount]);

  const moveToCompletedElements = (id: string) => {
    if (isLoading) {
      return;
    }

    if (!isWaiting || id !== lastClickedId) {
      setIsWaiting(true);
      setLastClickedId(id);
      const idtimeout = setTimeout(async () => {
        try {
          setIsLoading(true);
          await moveToCompleted(id, "Incarico");
          setData((prevData) => prevData.filter((item) => item.id !== id));
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

  const formActive = () => {
    openForm();
    scrollToForm(formRef);
  };

  return (
    <main>
      <ToolBar openForm={formActive} />
      <div className={styles.container} onClick={(event) => onSubmit(event)}>
        <div className={styles.flex}>
          <h1 className={styles.title}>Incarichi</h1>
          {isLoading && !formIsOpen && (
            <CircularProgress
              size={{
                width: 13,
                height: 13,
              }}
            />
          )}
        </div>
        <div
          className={`${styles.wrapperElements} ${
            isLoadingItems && data.length === 0 && styles.circularProgress
          }`}
        >
          <ErrorDialog setOpen={setErrorDialog} open={errorDialog} />
          {isLoadingItems && data.length === 0 && (
            <CircularProgress size={{ width: 20, height: 20 }} />
          )}

          <AnimatePresence initial={false}>
            {data.map((task) => {
              return (
                <Item
                  key={task.id}
                  data={task}
                  isLoading={isLoading}
                  handleClick={() => moveToCompletedElements(task.id)}
                />
              );
            })}
          </AnimatePresence>
          <AnimatePresence initial={false}>
            {!isLoadingItems && !formIsOpen && data.length === 0 && (
              <MessageEmpty message="Non hai incarichi" />
            )}
          </AnimatePresence>
          <div ref={formRef}>
            <AnimatePresence initial={false}>
              {formIsOpen && !isLoadingItems && (
                <FormItem isLoading={isLoading} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
