import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const sideBar = createSlice({
  name: "sideBar",
  initialState: {
    value: { isSideBarActive: true },
  },
  reducers: {
    setIsSideBarActive: (state, action: PayloadAction<boolean>) => {
      return {
        value: {
          isSideBarActive: action.payload,
        },
      };
    },
  },
});

export const { setIsSideBarActive } = sideBar.actions;
export default sideBar.reducer;
