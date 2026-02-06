import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser ,getAboutUser, getAllUsers, getConnectionsRequest, getMyConnectionRequests} from "../../action/authAction";

const initialState = {
  user: undefined,
  isError: false,
  isSuccess: false,
  isLoading: false,
  LoggedIn: false,
  message: "",
  isTokenThere:false,
  profileFetched: false,
  connections: [],
  connectionRequests: [],
  all_users :[],
  all_profiles_fetched:false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "Hello";
    },
    emptyMessage :(state) => {
      state.message = ""
    },
    setTokenIsThere:(state) => {
      state.isTokenThere = true
    },
    setTokenIsNotThere:(state) => {
      state.isTokenThere = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Knocking the door...";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.LoggedIn = true;
        state.message = "Login is Successfull!";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action.payload?.message ||
          action.payload ||
          action.error?.message ||
          "";
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Registering You...";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.LoggedIn = false;
        state.message = "Registration is successful , Please Login in"
          
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action.payload?.message ||
          action.payload ||
          action.error?.message ||
          "";
      })
      .addCase(getAboutUser.fulfilled,(state,action) => {
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
        state.user = action.payload.user
       
        
      })

      .addCase(getAllUsers.fulfilled,(state,action) => {
        state.isLoading = false;
        state.isError = false;
        state.all_profiles_fetched = true;
        state.all_users = action.payload.profiles
      })
      .addCase(getConnectionsRequest.fulfilled,(state,action) => {
        state.connections = action.payload
      })
      .addCase(getConnectionsRequest.rejected,(state,action) => {
        state.message = action.payload
      })
      .addCase(getMyConnectionRequests.fulfilled,(state,action) => {
        state.connectionRequests = action.payload
      })
      .addCase(getMyConnectionRequests.rejected,(state,action) => {
        state.message = action.payload
      });
  },
});


export const {reset,emptyMessage,setTokenIsThere,setTokenIsNotThere} = authSlice.actions;
export default authSlice.reducer;
