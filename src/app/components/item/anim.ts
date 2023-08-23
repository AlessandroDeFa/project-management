export const elIn = {
  initial: {
    opacity: 0,
    height: 0,
  },
  enter: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      opacity: { delay: 0.05 },
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};
