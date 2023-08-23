import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  value: FormValuesState;
};

type FormValuesState = {
  name: string;
  note: string;
  projectFor?: string;
  isCompleted: boolean;
  duedate?: string;
};

const initialState: InitialState = {
  value: {
    name: "",
    note: "",
    isCompleted: false,
  },
};

export const formValues = createSlice({
  name: "formValues",
  initialState,
  reducers: {
    updateName: (state, action: PayloadAction<string>) => {
      return {
        value: {
          name: action.payload,
          note: state.value.note,
          projectFor: state.value.projectFor,
          isCompleted: state.value.isCompleted,
          duedate: state.value.duedate,
        },
      };
    },
    updateNote: (state, action: PayloadAction<string>) => {
      return {
        value: {
          name: state.value.name,
          note: action.payload,
          projectFor: state.value.projectFor,
          isCompleted: state.value.isCompleted,
          duedate: state.value.duedate,
        },
      };
    },
    updateProjectFor: (state, action: PayloadAction<string>) => {
      return {
        value: {
          name: state.value.name,
          note: state.value.note,
          projectFor: action.payload,
          isCompleted: state.value.isCompleted,
          duedate: state.value.duedate,
        },
      };
    },
    updateIsCompleted: (state) => {
      return {
        value: {
          name: state.value.name,
          note: state.value.note,
          projectFor: state.value.projectFor,
          isCompleted: !state.value.isCompleted,
          duedate: state.value.duedate,
        },
      };
    },
    updateDuedate: (state, action: PayloadAction<string>) => {
      return {
        value: {
          name: state.value.name,
          note: state.value.note,
          projectFor: state.value.projectFor,
          isCompleted: state.value.isCompleted,
          duedate: action.payload,
        },
      };
    },
    resetState: () => {
      return initialState;
    },
  },
});

export const {
  updateName,
  updateNote,
  updateProjectFor,
  updateIsCompleted,
  updateDuedate,
  resetState,
} = formValues.actions;
export default formValues.reducer;
