"use client";
import Link from "next/link";
import {
  CheckmarkButton,
  ListAllButton,
  NoteButton,
  TaskButton,
} from "../svgs";
import styles from "./style.module.css";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/store";

interface CategoriesButtonProps {
  label: string;
  bgColor: string;
  href: string;
}

interface CountValues {
  countTask: number;
  countNote: number;
  countCompleted: number;
  countAllElements: number;
}

interface LabelToCountMap {
  [label: string]: keyof CountValues;
}

export default function CategoriesButton({
  label,
  bgColor,
  href,
}: CategoriesButtonProps) {
  const currentPage = usePathname();

  const labelToCountMap: LabelToCountMap = {
    Incarichi: "countTask",
    Appunti: "countNote",
    Tutti: "countAllElements",
    Completati: "countCompleted",
  };

  const elementCount = useAppSelector(
    (state) => state.countElementsReducer.value[labelToCountMap[label]]
  );

  const getIconComponent = (label: string) => {
    const color = currentPage === href ? bgColor : "white";
    switch (label) {
      case "Incarichi":
        return <TaskButton style={{ fill: color }} />;
      case "Appunti":
        return <NoteButton style={{ fill: color }} />;
      case "Tutti":
        return <ListAllButton style={{ fill: color }} />;
      default:
        return <CheckmarkButton style={{ fill: color }} />;
    }
  };

  return (
    <Link
      href={href}
      className={`${styles.wrapper} ${
        currentPage === href ? styles.active : ""
      }`}
      style={{
        backgroundColor: currentPage === href ? bgColor : "",
      }}
    >
      <div
        className={`${styles.icon}`}
        style={{
          backgroundColor: bgColor,
        }}
      >
        {getIconComponent(label)}
      </div>
      <div className={styles.label}>{label}</div>
      <div className={styles.counter}>{elementCount}</div>
    </Link>
  );
}
