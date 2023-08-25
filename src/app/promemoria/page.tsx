"use client";
import styles from "./style.module.css";
import ToolBar from "../components/tool-bar";
import Item from "../components/item";
import FormItem from "../components/formItem";
import { AnimatePresence } from "framer-motion";
import { useToggleForm } from "../utils/useToggleForm";
import { AppDispatch, useAppSelector } from "@/redux/store";
import {
  moveToCompleted,
  submitCompleted,
  submitMemo,
} from "../utils/apiService";
import { useDispatch } from "react-redux";
import { resetState } from "@/redux/features/formValues-slice";
import { useEffect, useRef, useState } from "react";
import MessageEmpty from "../components/messageEmpty";
import { MemoData } from "../utils/dataTypes";
import CircularProgress from "../components/circularProgress";
import { getMemo } from "../utils/fetchData";
import {
  updateAllElementsCount,
  updateCompletedCount,
  updateMemoCount,
} from "@/redux/features/countElements-slice";
import ErrorDialog from "../components/errorMessage";

export default function Promemoria() {
  const [formSubmit, setFormSubmit] = useState<boolean>(false);
  const [formIsOpen, openForm, closeForm] = useToggleForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingItems, setIsLoadingItems] = useState<boolean>(true);
  const [errorDialog, setErrorDialog] = useState<boolean>(false);
  const [lastClickedId, setLastClickedId] = useState<string | null>(null);
  const [shouldUpdateCount, setShouldUpdateCount] = useState(false);

  const [isWaiting, setIsWaiting] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const [data, setData] = useState<MemoData[]>([]);

  const { name, note, isCompleted, duedate } = useAppSelector(
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
        const memosData = await getMemo();
        setData(memosData);
        dispatch(updateMemoCount(memosData.length));
        setIsLoadingItems(false);
      } catch (error) {
        setIsLoadingItems(false);
        console.error(error);
        setErrorDialog(true);
      }
    };

    fetchTasks();
  }, [formSubmit]);

  const onSubmit = async (event: React.MouseEvent) => {
    const formValid = name !== "" && note !== "" && duedate != null;
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
              isCompleted: isCompleted,
              elementType: "Promemoria",
            }),
            new Promise((resolve) => setTimeout(resolve, 300)),
          ]);
          dispatch(updateCompletedCount(countCompleted + 1));
        } else {
          [res] = await Promise.allSettled([
            submitMemo({
              name: name,
              note: note,
              dueDate: duedate,
              isCompleted: isCompleted,
            }),
            new Promise((resolve) => setTimeout(resolve, 300)),
          ]);
        }

        dispatch(updateAllElementsCount(countAllElements + 1));

        setIsLoading(false);
        closeForm();
        setFormSubmit(!formSubmit);
        dispatch(resetState());
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
      dispatch(updateMemoCount(data.length));
      setShouldUpdateCount(false);
    }
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
          await moveToCompleted(id, "Promemoria");
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

  return (
    <main>
      <ToolBar openForm={openForm} />
      <div className={styles.container} onClick={(event) => onSubmit(event)}>
        <div className={styles.flex}>
          <h1 className={styles.title}>Promemoria</h1>
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
            {data.map((memo) => {
              return (
                <Item
                  key={memo.id}
                  data={memo}
                  isLoading={isLoading}
                  handleClick={() => moveToCompletedElements(memo.id)}
                />
              );
            })}
          </AnimatePresence>
          <AnimatePresence initial={false}>
            {!isLoadingItems && !formIsOpen && data.length === 0 && (
              <MessageEmpty message="Non hai promemoria" />
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
