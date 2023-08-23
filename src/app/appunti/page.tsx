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
  submitNote,
} from "../utils/apiService";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { resetState } from "@/redux/features/formValues-slice";
import { NoteData } from "../utils/dataTypes";
import { getNote } from "../utils/fetchData";
import CircularProgress from "../components/circularProgress";
import MessageEmpty from "../components/messageEmpty";
import { updateNoteCount } from "@/redux/features/countElements-slice";

export default function Appunti() {
  const [formSubmit, setFormSubmit] = useState<boolean>(false);
  const [formIsOpen, openForm, closeForm] = useToggleForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingItems, setIsLoadingItems] = useState<boolean>(true);
  const formRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<NoteData[]>([]);

  const [isWaiting, setIsWaiting] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const name = useAppSelector((state) => state.formValuesReducer.value.name);

  const note = useAppSelector((state) => state.formValuesReducer.value.note);

  const projectFor = useAppSelector(
    (state) => state.formValuesReducer.value.projectFor
  );

  const isCompleted = useAppSelector(
    (state) => state.formValuesReducer.value.isCompleted
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(resetState());
    const fetchTasks = async () => {
      try {
        setIsLoadingItems(true);
        const noteData = await getNote();
        setData(noteData);
        dispatch(updateNoteCount(noteData.length));
        setIsLoadingItems(false);
      } catch (error) {
        setIsLoadingItems(false);
        console.error(error);
      }
    };

    fetchTasks();
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
              elementType: "Appunti",
            }),
            new Promise((resolve) => setTimeout(resolve, 300)),
          ]);
        } else {
          [res] = await Promise.allSettled([
            submitNote({
              name: name,
              note: note,
              projectFor: projectFor,
              isCompleted: isCompleted,
            }),
            new Promise((resolve) => setTimeout(resolve, 300)),
          ]);
        }

        if (res.status != "fulfilled") {
          console.log(res);
        }
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

  const moveToCompletedElements = (id: string) => {
    if (!isWaiting) {
      setIsWaiting(true);
      const idtimeout = setTimeout(async () => {
        try {
          setIsLoading(true);
          await moveToCompleted(id, "Appunti");
          setData(data.filter((item) => item.id !== id));
          setIsLoading(false);
          dispatch(updateNoteCount(data.length - 1));
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
      <ToolBar openForm={openForm} />
      <div className={styles.container} onClick={(event) => onSubmit(event)}>
        <div className={styles.flex}>
          <h1 className={styles.title}>Appunti</h1>
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
          {isLoadingItems && data.length === 0 && (
            <CircularProgress size={{ width: 20, height: 20 }} />
          )}
          <AnimatePresence initial={false}>
            {data.map((note) => {
              return (
                <Item
                  key={note.id}
                  data={note}
                  handleClick={() => moveToCompletedElements(note.id)}
                />
              );
            })}
          </AnimatePresence>
          <AnimatePresence initial={false}>
            {!isLoadingItems && !formIsOpen && data.length === 0 && (
              <MessageEmpty message="Non hai appunti" />
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
