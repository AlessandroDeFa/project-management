"use client";
import { useDispatch } from "react-redux";
import { AddButton, ToggleSideBar, ToggleTheme } from "../svgs";
import styles from "./style.module.css";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { setIsSideBarActive } from "@/redux/features/sidebar-slice";
import { useTheme } from "next-themes";

interface ToolBarProps {
  disabledAddButton?: boolean;
  openForm?: () => void;
}

export default function ToolBar({ disabledAddButton, openForm }: ToolBarProps) {
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const isActive = useAppSelector(
    (state) => state.sideBarReducer.value.isSideBarActive
  );

  const toggleSidebar = () => {
    dispatch(setIsSideBarActive(!isActive));
  };

  return (
    <div className={styles.wrapper}>
      <div>
        <button onClick={toggleSidebar}>
          <ToggleSideBar className={styles.icon} />
        </button>
      </div>
      <div className={styles.gap}>
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <ToggleTheme className={styles.icon} />
        </button>
        {!disabledAddButton && (
          <button onClick={openForm}>
            <AddButton className={styles.icon} />
          </button>
        )}
      </div>
    </div>
  );
}
