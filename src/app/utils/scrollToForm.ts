import { RefObject } from "react";

const scrollToForm = (ref: RefObject<HTMLDivElement>) => {
  setTimeout(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, 10);
};

export default scrollToForm;
