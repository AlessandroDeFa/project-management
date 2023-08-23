"use client";
import Link from "next/link";
import { ActionIcon } from "../svgs";
import styles from "./style.module.css";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/store";

interface ActionButtonProps {
  label: string;
  bgColor: string;
  href: string;
}

interface CountValues {
  countProjects: number;
  countMemo: number;
}

interface LabelToCountMap {
  [label: string]: keyof CountValues;
}

export default function ActionButton({
  label,
  bgColor,
  href,
}: ActionButtonProps) {
  const currentPage = usePathname();

  const labelToCountMap: LabelToCountMap = {
    Promemoria: "countMemo",
    Progetti: "countProjects",
  };

  const elementCount = useAppSelector(
    (state) => state.countElementsReducer.value[labelToCountMap[label]]
  );

  return (
    <Link
      href={href}
      className={`${styles.wrapper} ${
        currentPage === href ? styles.active : ""
      }`}
    >
      <div>
        <div
          className={styles.icon}
          style={{
            backgroundColor: bgColor,
          }}
        >
          <ActionIcon />
        </div>
        <div>{label}</div>
      </div>

      <div>{elementCount}</div>
    </Link>
  );
}
