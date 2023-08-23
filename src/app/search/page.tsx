"use client";
import styles from "./style.module.css";
import ToolBar from "../components/tool-bar";
import Item from "../components/item";
import { AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/redux/store";
import { useEffect } from "react";

export default function Appunti() {
  const { query, values } = useAppSelector(
    (state) => state.queryValuesReducer.value
  );

  const countCompleted = values?.filter((item) => item.isCompleted);

  useEffect(() => {
    const newUrl = `/search?q=${query}`;
    window.history.replaceState({}, "", newUrl);
  }, [query]);

  return (
    <main>
      <ToolBar disabledAddButton={true} />
      <div className={styles.container}>
        <div className={styles.flex}>
          <h1 className={styles.title}>Risultati per "{query}" </h1>
        </div>
        <div className={styles.completedInfo}>
          <p>
            {countCompleted?.length || 0}
            {countCompleted?.length === 1 ? " completato" : " completati"}
          </p>
        </div>
        <div className={styles.wrapperElements}>
          <AnimatePresence initial={false}>
            {values &&
              values.map((value) => {
                return <Item key={value.id} data={value} />;
              })}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
