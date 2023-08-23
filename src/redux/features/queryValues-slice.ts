import { AllElements } from "@/app/utils/dataTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  value: SearchValues;
};

interface SearchValues {
  query: string;
  values: AllElements[] | null;
}

const initialState: InitialState = {
  value: {
    query: "",
    values: null,
  },
};

export const queryValues = createSlice({
  name: "queryValues",
  initialState,
  reducers: {
    updateSearchValues: (state, action: PayloadAction<SearchValues>) => {
      return {
        value: {
          query: action.payload.query,
          values: action.payload.values,
        },
      };
    },
  },
});

export const { updateSearchValues } = queryValues.actions;
export default queryValues.reducer;
