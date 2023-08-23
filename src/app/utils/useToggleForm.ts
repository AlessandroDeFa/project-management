import { useState } from "react";

export const useToggleForm = (): [boolean, () => void, () => void] => {
  const [formIsOpen, setFormIsOpen] = useState<boolean>(false);

  const openForm = () => {
    if (formIsOpen) return;
    setFormIsOpen(true);
  };

  const closeForm = () => {
    setFormIsOpen(false);
  };

  return [formIsOpen, openForm, closeForm];
};
