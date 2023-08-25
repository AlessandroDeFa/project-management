import * as AlertDialog from "@radix-ui/react-alert-dialog";
import styles from "./style.module.css";
import { AnimatePresence, motion } from "framer-motion";
import { alertPopUp } from "./anim";
import { deleteAllCompletedElements } from "@/app/utils/apiService";
import { Dispatch, SetStateAction } from "react";
import { CompletedElement } from "@/app/utils/dataTypes";
import { updateCompletedCount } from "@/redux/features/countElements-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Image from "next/image";

interface AlertDialogCompletedProps {
  countCompleted: number;
  setData: Dispatch<SetStateAction<CompletedElement[]>>;
}

const AlertDialogCompleted = ({
  countCompleted,
  setData,
}: AlertDialogCompletedProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const submitDeleteCompletedElements = async () => {
    try {
      await deleteAllCompletedElements();
      setData([]);
      dispatch(updateCompletedCount(0));
    } catch (error) {
      console.error("Errore durante l'eliminazione:", error);
    }
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        {countCompleted !== 0 && <button>Cancella</button>}
      </AlertDialog.Trigger>
      <AnimatePresence>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className={styles.AlertDialogOverlay} />

          <AlertDialog.Content className={styles.AlertDialogContent} asChild>
            <motion.div
              variants={alertPopUp}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              <div className={styles.logo}>
                <Image fill alt="logo" src={"/logo.jpeg"} />
              </div>
              <AlertDialog.Title className={styles.AlertDialogTitle}>
                Vuoi cancellare tutti gli elementi completati?
              </AlertDialog.Title>

              <AlertDialog.Description
                className={styles.AlertDialogDescription}
              >
                {countCompleted === 1
                  ? `${countCompleted} elemento completato verrà eliminato `
                  : `${countCompleted} elementi completati verranno eliminati `}
                dall'elenco. L'azione è irreversibile.
              </AlertDialog.Description>
              <div className={styles.wrapperBtn}>
                <AlertDialog.Cancel asChild>
                  <button className={styles.button}>Annulla</button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <button
                    className={`${styles.button} ${styles.remove}`}
                    onClick={submitDeleteCompletedElements}
                  >
                    Elimina
                  </button>
                </AlertDialog.Action>
              </div>
            </motion.div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AnimatePresence>
    </AlertDialog.Root>
  );
};

export default AlertDialogCompleted;
