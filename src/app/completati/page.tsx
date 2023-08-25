"use client";
import styles from "./style.module.css";
import ToolBar from "../components/tool-bar";
import Item from "../components/item";
import { useEffect, useState } from "react";
import { getCompleted } from "../utils/fetchData";
import { CompletedElement } from "../utils/dataTypes";
import { AnimatePresence } from "framer-motion";
import CircularProgress from "../components/circularProgress";
import MessageEmpty from "../components/messageEmpty";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import {
  updateAllElementsCount,
  updateCompletedCount,
} from "@/redux/features/countElements-slice";
import AlertDialogCompleted from "../components/alertDialog";
import { deletedSelectedElement } from "../utils/apiService";
import ErrorDialog from "../components/errorMessage";

export default function Completati() {
  const [data, setData] = useState<CompletedElement[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorDialog, setErrorDialog] = useState<boolean>(false);

  const { countCompleted, countAllElements } = useAppSelector(
    (state) => state.countElementsReducer.value
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoadingItems(true);
        const completedData = await getCompleted();
        setData(completedData);
        dispatch(updateCompletedCount(completedData.length));
        setIsLoadingItems(false);
      } catch (error) {
        console.error(error);
        setIsLoadingItems(false);
        setErrorDialog(true);
      }
    };

    fetchTasks();
  }, []);

  const deleteCompletedElement = async (id: string) => {
    if (isLoading) {
      return;
    }
    try {
      setIsLoading(true);
      await deletedSelectedElement(id);
      setData(data.filter((item) => item.id !== id));
      setIsLoading(false);
      dispatch(updateCompletedCount(data.length - 1));
      dispatch(updateAllElementsCount(countAllElements - 1));
    } catch (error) {
      console.error("Errore durante l'eliminazione:", error);
    }
    setIsLoading(false);
  };

  return (
    <main>
      <ToolBar disabledAddButton={true} />
      <div className={styles.container}>
        <div className={styles.flex}>
          <h1 className={styles.title}>Completati</h1>
          <span>{data.length || countCompleted}</span>
        </div>
        <div className={styles.completedInfo}>
          <p>
            {data.length || countCompleted}
            {data.length === 1 && countCompleted === 1
              ? " completato"
              : " completati"}
          </p>
          <p>&bull;</p>
          <AlertDialogCompleted
            setData={setData}
            countCompleted={countCompleted}
          />
          {isLoading && (
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
            isLoadingItems && styles.circularProgress
          }`}
        >
          <ErrorDialog setOpen={setErrorDialog} open={errorDialog} />

          {isLoadingItems && (
            <CircularProgress size={{ width: 20, height: 20 }} />
          )}
          <AnimatePresence initial={false}>
            {data.map((completed) => {
              return (
                <Item
                  key={completed.id}
                  data={completed}
                  handleClick={() => deleteCompletedElement(completed.id)}
                />
              );
            })}
          </AnimatePresence>
          {!isLoadingItems && data.length === 0 && (
            <MessageEmpty message="Non hai elementi completati" />
          )}
        </div>
      </div>
    </main>
  );
}
