// Installed Utils
import axios, { type AxiosResponse } from '@/axios';
import { createAsyncThunk, createSlice, GetThunkAPI } from '@reduxjs/toolkit';
import nookies from 'nookies';

// App Utils
import ApiResponse from '@/app/models/ApiResponse';
import { User } from '@/app/models/User';
import { AsyncThunkConfig } from '@/lib/redux/store';

// Get the user info
export const userInfo = createAsyncThunk(
  'api/user/info',
  async (_, thunkAPI: GetThunkAPI<AsyncThunkConfig>) => {
    try {
      // Send request
      const response: AxiosResponse<ApiResponse<User>> = await axios.get('api/user/info');
      return response.data;
    } catch (error: unknown) {
      const message = ( error instanceof Error )?error.message:error as string;
      return thunkAPI.rejectWithValue(message)
    }
  }
);

// Slice for user's data
const userSlice = createSlice({
  name: 'userInfo',
  initialState: {
    user: null as User | null,
    isAuthenticated: true,
    errorMessage: ''
  },
  reducers: {
    logout: (state) => {
      nookies.destroy(null, 'jwt_token', { path: '/' });
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userInfo.fulfilled, (state, action) => {
        if ( action.payload.success ) {
          state.user = action.payload.content;
        } else {
          state.isAuthenticated = false;
          nookies.destroy(null, 'jwt_token', { path: '/' });
          state.errorMessage = action.payload.message;
        }
      })
      .addCase(userInfo.rejected, (state, action) => {
        state.isAuthenticated = false;
        nookies.destroy(null, 'jwt_token', { path: '/' });
        state.errorMessage = action.payload as string;
      });
  },
});

// Get reducer from the user slice
const { reducer } = userSlice;

// Export the logout reducer
export const { logout } = userSlice.actions;

// Export the reducer
export default reducer;