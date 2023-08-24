import styles from "./style.module.css";
import { DropDownIcon } from "../svgs";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { opacity } from "./anim";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { updateProjectFor } from "@/redux/features/formValues-slice";
import { ProjectData } from "@/app/utils/dataTypes";
import CircularProgress from "../circularProgress";

interface DropdownProps {
  data: ProjectData[];
  isLoading: boolean;
}

export const Dropdown = ({ data, isLoading }: DropdownProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const projectFor = useAppSelector(
    (state) => state.formValuesReducer.value.projectFor
  );

  const dispatch = useDispatch<AppDispatch>();

  const onSelect = (e: Event) => {
    const item = e.target as HTMLElement;
    dispatch(updateProjectFor(item.innerText));
  };

  useEffect(() => {
    dispatch(updateProjectFor(data[0]?.name));
  }, [data]);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild className={styles.trigger}>
        <div className={styles.container}>
          <button className={styles.triggerMenu}>
            <span>
              {isLoading ? (
                <CircularProgress size={{ width: 9, height: 9 }} />
              ) : (
                projectFor || "nessun progetto"
              )}
            </span>
            <span className={styles.icon}>
              <DropDownIcon />
            </span>
          </button>
        </div>
      </DropdownMenu.Trigger>
      <AnimatePresence>
        {open && data.length !== 0 && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content
              data-clickable="true"
              align="start"
              className={styles.menuContent}
              sideOffset={5}
              asChild
            >
              <motion.div
                variants={opacity}
                initial="initial"
                animate="open"
                exit="closed"
              >
                {data.map((project) => {
                  return (
                    <DropdownMenu.Item
                      data-clickable="true"
                      onSelect={(e) => onSelect(e)}
                      className={styles.menuItem}
                    >
                      {project.name}
                    </DropdownMenu.Item>
                  );
                })}
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
};
