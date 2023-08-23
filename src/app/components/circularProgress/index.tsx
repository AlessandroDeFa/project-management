import styles from "./style.module.css";

interface CircularProgressProps {
  size: {
    width: number;
    height: number;
  };
}

export default function CircularProgress({ size }: CircularProgressProps) {
  return (
    <svg
      style={{
        width: size.width,
        height: size.height,
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
    >
      <line
        className={styles.line}
        x1="25"
        y1="25"
        x2="37"
        y2="25"
        transform="rotate(0 25 25) translate(11 0)"
        style={{ animationDelay: "-733ms" }}
      ></line>
      <line
        className={styles.line}
        x1="25"
        y1="25"
        x2="37"
        y2="25"
        transform="rotate(30 25 25) translate(11 0)"
        style={{ animationDelay: "-667ms" }}
      ></line>
      <line
        className={styles.line}
        x1="25"
        y1="25"
        x2="37"
        y2="25"
        transform="rotate(60 25 25) translate(11 0)"
        style={{ animationDelay: "-600ms" }}
      ></line>
      <line
        className={styles.line}
        x1="25"
        y1="25"
        x2="37"
        y2="25"
        transform="rotate(90 25 25) translate(11 0)"
        style={{ animationDelay: "-533ms" }}
      ></line>
      <line
        className={styles.line}
        x1="25"
        y1="25"
        x2="37"
        y2="25"
        transform="rotate(120 25 25) translate(11 0)"
        style={{ animationDelay: "-467ms" }}
      ></line>
      <line
        className={styles.line}
        x1="25"
        y1="25"
        x2="37"
        y2="25"
        transform="rotate(150 25 25) translate(11 0)"
        style={{ animationDelay: "-400ms" }}
      ></line>
      <line
        className={styles.line}
        x1="25"
        y1="25"
        x2="37"
        y2="25"
        transform="rotate(180 25 25) translate(11 0)"
        style={{ animationDelay: "-333ms" }}
      ></line>
      <line
        className={styles.line}
        x1="25"
        y1="25"
        x2="37"
        y2="25"
        transform="rotate(210 25 25) translate(11 0)"
        style={{ animationDelay: "-267ms" }}
      ></line>
      <line
        className={styles.line}
        x1="25"
        y1="25"
        x2="37"
        y2="25"
        transform="rotate(240 25 25) translate(11 0)"
        style={{ animationDelay: "-200ms" }}
      ></line>
      <line
        className={styles.line}
        x1="25"
        y1="25"
        x2="37"
        y2="25"
        transform="rotate(270 25 25) translate(11 0)"
        style={{ animationDelay: "-133ms" }}
      ></line>
      <line
        className={styles.line}
        x1="25"
        y1="25"
        x2="37"
        y2="25"
        transform="rotate(300 25 25) translate(11 0)"
        style={{ animationDelay: "-67ms" }}
      ></line>
      <line
        className={styles.line}
        x1="25"
        y1="25"
        x2="37"
        y2="25"
        transform="rotate(330 25 25) translate(11 0)"
        style={{
          animationDelay: "0ms",
        }}
      ></line>
    </svg>
  );
}
