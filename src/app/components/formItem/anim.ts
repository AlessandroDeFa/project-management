export const formIn = {
  initial: {
    opacity: 0,
    y: "-100%",
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      opacity: { delay: 0.05 },
    },
  },
  exit: {
    opacity: 0,
    y: "-100%",
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};
