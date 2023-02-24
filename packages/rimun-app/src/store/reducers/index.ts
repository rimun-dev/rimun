import { combineReducers } from "redux";
import { authSlice } from "src/store/reducers/auth";
import { deviceSlice } from "src/store/reducers/device";

const reducers = combineReducers({
  auth: authSlice.reducer,
  device: deviceSlice.reducer,
});

export default reducers;
