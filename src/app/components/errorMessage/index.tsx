import * as AlertDialog from "@radix-ui/react-alert-dialog";
import styles from "./style.module.css";
import { AnimatePresence, motion } from "framer-motion";
import { alertPopUp } from "../alertDialog/anim";

interface ErrorDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const ErrorDialog = ({ open, setOpen }: ErrorDialogProps) => {
  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AnimatePresence>
        <AlertDialog.Portal>
          <AlertDialog.Content className={styles.AlertDialogContent} asChild>
            <motion.div
              variants={alertPopUp}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              <AlertDialog.Title className={styles.AlertDialogTitle}>
                Errore nel recupero degli elementi
              </AlertDialog.Title>

              <AlertDialog.Description
                className={styles.AlertDialogDescription}
              >
                Si è verificato un errore durante il recupero dei dati. Riprova
                più tardi.
              </AlertDialog.Description>
              <div className={styles.wrapperBtn}>
                <AlertDialog.Cancel asChild>
                  <button className={styles.button}>OK</button>
                </AlertDialog.Cancel>
              </div>
            </motion.div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AnimatePresence>
    </AlertDialog.Root>
  );
};

export default ErrorDialog;
