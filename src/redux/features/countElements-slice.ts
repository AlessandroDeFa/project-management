import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";

type InitialState = {
  value: CountValues;
};

type CountValues = {
  countTask: number;
  countNote: number;
  countCompleted: number;
  countMemo: number;
  countProjects: number;
  countAllElements: number;
};

const initialState: InitialState = {
  value: {
    countTask: 0,
    countNote: 0,
    countCompleted: 0,
    countMemo: 0,
    countProjects: 0,
    countAllElements: 0,
  },
};

export const countElements = createSlice({
  name: "countElements",
  initialState,
  reducers: {
    updateTaskCount: (state, action: PayloadAction<number>) => {
      return {
        value: {
          countTask: action.payload,
          countNote: state.value.countNote,
          countCompleted: state.value.countCompleted,
          countMemo: state.value.countMemo,
          countProjects: state.value.countProjects,
          countAllElements: state.value.countAllElements,
        },
      };
    },
    updateNoteCount: (state, action: PayloadAction<number>) => {
      return {
        value: {
          countTask: state.value.countTask,
          countNote: action.payload,
          countCompleted: state.value.countCompleted,
          countMemo: state.value.countMemo,
          countProjects: state.value.countProjects,
          countAllElements: state.value.countAllElements,
        },
      };
    },
    updateCompletedCount: (state, action: PayloadAction<number>) => {
      return {
        value: {
          countTask: state.value.countTask,
          countNote: state.value.countNote,
          countCompleted: action.payload,
          countMemo: state.value.countMemo,
          countProjects: state.value.countProjects,
          countAllElements: state.value.countAllElements,
        },
      };
    },
    updateMemoCount: (state, action: PayloadAction<number>) => {
      return {
        value: {
          countTask: state.value.countTask,
          countNote: state.value.countNote,
          countCompleted: state.value.countCompleted,
          countMemo: action.payload,
          countProjects: state.value.countProjects,
          countAllElements: state.value.countAllElements,
        },
      };
    },
    updateProjectsCount: (state, action: PayloadAction<number>) => {
      return {
        value: {
          countTask: state.value.countTask,
          countNote: state.value.countNote,
          countCompleted: state.value.countCompleted,
          countMemo: state.value.countMemo,
          countProjects: action.payload,
          countAllElements: state.value.countAllElements,
        },
      };
    },
    updateAllElementsCount: (state, action: PayloadAction<number>) => {
      return {
        value: {
          countTask: state.value.countTask,
          countNote: state.value.countNote,
          countCompleted: state.value.countCompleted,
          countMemo: state.value.countMemo,
          countProjects: state.value.countProjects,
          countAllElements: action.payload,
        },
      };
    },
  },
});

export const {
  updateTaskCount,
  updateNoteCount,
  updateCompletedCount,
  updateMemoCount,
  updateProjectsCount,
  updateAllElementsCount,
} = countElements.actions;
export default countElements.reducer;
