import { opacity } from "../dropdown/anim";
import styles from "./style.module.css";
import { motion } from "framer-motion";

interface MessageEmptyProps {
  message: string;
}

export default function MessageEmpty({ message }: MessageEmptyProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
      }}
      exit={{ opacity: 0 }}
      className={styles.message}
    >
      {message}
    </motion.div>
  );
}
