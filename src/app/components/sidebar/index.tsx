"use client";
import { AppDispatch, useAppSelector } from "@/redux/store";
import ActionButton from "../actionButton";
import CategoriesButton from "../categoriesButton";
import SearchBar from "../search-bar";
import { width } from "./anim";
import styles from "./style.module.css";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { getCounts } from "@/app/utils/fetchData";
import { CountsData } from "@/app/utils/dataTypes";
import { useDispatch } from "react-redux";
import {
  updateAllElementsCount,
  updateCompletedCount,
  updateMemoCount,
  updateNoteCount,
  updateProjectsCount,
  updateTaskCount,
} from "@/redux/features/countElements-slice";

let propsCategoriesButton = [
  {
    label: "Incarichi",
    bgColor: "#0087FF",
    href: "/",
  },
  {
    label: "Appunti",
    bgColor: "#FF0000",
    href: "/appunti",
  },
  {
    label: "Tutti",
    bgColor: "#6F7E88",
    href: "/tutti",
  },
  {
    label: "Completati",
    bgColor: "#2ed15b",
    href: "/completati",
  },
];

let propsActionButton = [
  {
    label: "Promemoria",
    bgColor: "#FFA500",
    href: "/promemoria",
  },
  {
    label: "Progetti",
    bgColor: "#0087FF",
    href: "/progetti",
  },
];

export default function Sidebar() {
  const isActive = useAppSelector(
    (state) => state.sideBarReducer.value.isSideBarActive
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchCounts = async () => {
      const counts: CountsData = await getCounts();
      dispatch(updateTaskCount(counts.countTasks));
      dispatch(updateNoteCount(counts.countNotes));
      dispatch(updateProjectsCount(counts.countProjects));
      dispatch(updateCompletedCount(counts.countCompleted));
      dispatch(updateMemoCount(counts.countMemo));
      let countAllElement = 0;
      for (const key in counts) {
        if (Object.hasOwnProperty.call(counts, key)) {
          countAllElement += counts[key];
        }
      }
      dispatch(updateAllElementsCount(countAllElement));
    };

    fetchCounts();
  }, []);

  return (
    <motion.div
      variants={width}
      initial="initial"
      animate={isActive ? "open" : "closed"}
      exit="closed"
      className={styles.wrapper}
    >
      <div className={styles.innerWrapper}>
        <SearchBar />
        <div className={styles.wrapperCategories}>
          {propsCategoriesButton.map((category, index) => {
            return (
              <CategoriesButton
                href={category.href}
                label={category.label}
                bgColor={category.bgColor}
                key={index}
              />
            );
          })}
        </div>
        <div className={styles.wrapperActionButtons}>
          {propsActionButton.map((actionButton, index) => {
            return (
              <ActionButton
                href={actionButton.href}
                label={actionButton.label}
                bgColor={actionButton.bgColor}
                key={index}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
