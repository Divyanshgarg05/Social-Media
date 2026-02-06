import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";

// Steps for state management
// Submit action
// Handle Action in its Reducer
// Register here -> Reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    postReducer:postReducer,
  }
});
