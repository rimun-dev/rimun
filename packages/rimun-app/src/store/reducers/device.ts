import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const SLICE_NAME = "device";

interface AlertDescriptor {
  status: "error" | "warn" | "info" | "success";
  message?: string;
}
export interface DeviceState {
  isFirstTime: boolean;
  displayAlertTimestamp: number;
  alert?: AlertDescriptor;
}

export const initialState = {
  isFirstTime: true,
  displayAlertTimestamp: -1,
  alert: undefined,
} as DeviceState;

export const deviceSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    displayAlert: (state, action: PayloadAction<AlertDescriptor>) => ({
      ...state,
      displayAlertTimestamp: Date.now(),
      alert: action.payload,
    }),
    dismissAlert: (state) => ({
      ...state,
      displayAlertTimestamp: -1,
      alert: undefined,
    }),
  },
});

export const DeviceActions = deviceSlice.actions;
