// Installed Utils
import axios, { type AxiosResponse } from '@/axios';
import { createAsyncThunk, createSlice, GetThunkAPI, } from '@reduxjs/toolkit';
import nookies from 'nookies';

// App Utils
import ApiResponse from '@/app/models/ApiResponse';
import { UserBasic, UserToken, UserEmail, UserNewPassword, UserSocial, User } from '@/app/models/User';
import { AsyncThunkConfig, RootState } from '@/lib/redux/store';

// Register a new user
export const register = createAsyncThunk(
  'auth/register',
  async (user: UserBasic, thunkAPI: GetThunkAPI<AsyncThunkConfig>) => {
    try {
      // Send request
      const response: AxiosResponse<ApiResponse<null>> = await axios.post('api/auth/register', user);
      return response.data;
    } catch (error: unknown) {
      const message = ( error instanceof Error )?error.message:error as string;
      return thunkAPI.rejectWithValue(message)
    }
  }
);

// Login a user
export const login = createAsyncThunk(
  'auth/sign-in',
  async (user: UserBasic, thunkAPI: GetThunkAPI<AsyncThunkConfig>) => {
    try {
      // Send request
      const response: AxiosResponse<ApiResponse<UserToken & User>> = await axios.post('api/auth/sign-in', user);
      return response.data;
    } catch (error: unknown) {
      const message = ( error instanceof Error )?error.message:error as string;
      return thunkAPI.rejectWithValue(message)
    }
  }
);

// Reset password
export const reset = createAsyncThunk(
  'auth/reset',
  async (user: UserEmail, thunkAPI: GetThunkAPI<AsyncThunkConfig>) => {
    try {
      // Send request
      const response: AxiosResponse<ApiResponse<null>> = await axios.post('api/auth/reset', user);
      return response.data;
    } catch (error: unknown) {
      const message = ( error instanceof Error )?error.message:error as string;
      return thunkAPI.rejectWithValue(message)
    }
  }
);

// Create a new password
export const changePassword = createAsyncThunk(
  'auth/change-password',
  async (user: UserNewPassword, thunkAPI: GetThunkAPI<AsyncThunkConfig>) => {
    try {
      // Send request
      const response: AxiosResponse<ApiResponse<null>> = await axios.post('api/auth/change-password', user);
      return response.data;
    } catch (error: unknown) {
      const message = ( error instanceof Error )?error.message:error as string;
      return thunkAPI.rejectWithValue(message)
    }
  }
);

// Exchange the authorization code to user's information
export const changeSocialCode = createAsyncThunk(
  'auth/get-social-info',
  async (code: string, thunkAPI: GetThunkAPI<AsyncThunkConfig>) => {
    try {
      // Send request
      const response: AxiosResponse<ApiResponse<UserSocial & User & UserToken>> = await axios.post('api/auth/get-social-info', {
        'code': code
      });
      return response.data;
    } catch (error: unknown) {
      const message = ( error instanceof Error )?error.message:error as string;
      return thunkAPI.rejectWithValue(message)
    }
  }
);

// Register a new user
export const registerSocial = createAsyncThunk(
  'auth/social-register',
  async (user: UserBasic, thunkAPI: GetThunkAPI<AsyncThunkConfig>) => {
    try {
      // Get the slice state
      const state = thunkAPI.getState() as RootState;
      // Send request
      const response: AxiosResponse<ApiResponse<null>> = await axios.post('api/auth/social-register', {
        social_id: state.auth.social.social_id,
        email: state.auth.social.email,
        password: user.password
      });
      return response.data;
    } catch (error: unknown) {
      const message = ( error instanceof Error )?error.message:error as string;
      return thunkAPI.rejectWithValue(message)
    }
  }
);

// Slice for authentification
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        registration: {
          successMessage: '',
          errorMessage: '',
          isLoading: false
        },       
        login: {
          successMessage: '',
          errorMessage: '',
          isLoading: false
        },       
        reset: {
          successMessage: '',
          errorMessage: '',
          isLoading: false
        },
        changePassword: {
          successMessage: '',
          errorMessage: '',
          isLoading: false
        },
        social: {
          errorMessage: '',
          isLoading: true,
          email: '',
          social_id: '',
          login: false      
        },
        socialRegistration: {
          registrationSuccessMessage: '',
          registrationErrorMessage: '',
          registrationIsLoading: false
        }
    },
    reducers: {     
      resetState: (state) => {
        state.registration.isLoading = false;
        state.registration.successMessage = '';
        state.registration.errorMessage = '';        
        state.login.isLoading = false;
        state.login.successMessage = '';
        state.login.errorMessage = '';
        state.reset.isLoading = false;
        state.reset.successMessage = '';
        state.reset.errorMessage = '';
        state.changePassword.isLoading = false;
        state.changePassword.successMessage = '';
        state.changePassword.errorMessage = '';  
        state.social.isLoading = false;
        state.social.errorMessage = '';
        state.social.email = '';
        state.social.social_id = '';
        state.socialRegistration.registrationIsLoading = false;
        state.socialRegistration.registrationSuccessMessage = '';
        state.socialRegistration.registrationErrorMessage = '';
      },
      setLoginErrorMessage: (state, action) => {
        state.login.errorMessage = action.payload;
      }
    },
    extraReducers(builder) {
      builder
      .addCase(register.pending, (state) => {
        state.registration.isLoading = true;
        state.registration.successMessage = '';
        state.registration.errorMessage = '';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.registration.isLoading = false;
        if ( action.payload.success ) {
          state.registration.successMessage = action.payload.message;  
        } else {
          state.registration.errorMessage = action.payload.message;
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.registration.isLoading = false;
        state.registration.errorMessage = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.login.isLoading = true;
        state.login.successMessage = '';
        state.login.errorMessage = '';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.login.isLoading = false;
        if ( action.payload.success ) {
          // Set success message
          state.login.successMessage = action.payload.message;
          // Create the cookie
          nookies.set(null, 'jwt_token', action.payload.content!.token, {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
            secure: true,
            sameSite: 'Strict'
          });
        } else {
          state.login.errorMessage = ('errors' in action.payload && Array.isArray(action.payload.errors))?action.payload.errors[0].msg:action.payload.message;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.login.isLoading = false;
        state.login.errorMessage = action.payload as string;
      })
      .addCase(reset.pending, (state) => {
        state.reset.isLoading = true;
        state.reset.successMessage = '';
        state.reset.errorMessage = '';
      })
      .addCase(reset.fulfilled, (state, action) => {
        state.reset.isLoading = false;
        if ( action.payload.success ) {
          state.reset.successMessage = action.payload.message;  
        } else {
          state.reset.errorMessage = ('errors' in action.payload && Array.isArray(action.payload.errors))?action.payload.errors[0].msg:action.payload.message;
        }
      })
      .addCase(reset.rejected, (state, action) => {
        state.reset.isLoading = false;
        state.reset.errorMessage = action.payload as string;
      })
      .addCase(changePassword.pending, (state) => {
        state.changePassword.isLoading = true;
        state.changePassword.successMessage = '';
        state.changePassword.errorMessage = '';
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.changePassword.isLoading = false;
        if ( action.payload.success ) {
          state.changePassword.successMessage = action.payload.message;  
        } else {
          state.changePassword.errorMessage = ('errors' in action.payload && Array.isArray(action.payload.errors))?action.payload.errors[0].msg:action.payload.message;
        }
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changePassword.isLoading = false;
        state.changePassword.errorMessage = action.payload as string;
      })  
      .addCase(changeSocialCode.pending, (state) => {
        state.social.isLoading = true;
        state.social.errorMessage = '';
      })
      .addCase(changeSocialCode.fulfilled, (state, action) => {
        state.social.isLoading = false;
        if ( action.payload.success ) {
          if ( typeof action.payload.content!.id !== 'undefined' ) {
            state.social.login = true;
            // Create the cookie
            nookies.set(null, 'jwt_token', action.payload.content!.token, {
              maxAge: 30 * 24 * 60 * 60,
              path: '/',
              secure: true,
              sameSite: 'Strict'
            });
          } else {
            state.social.email = action.payload.content!.email;
            state.social.social_id = action.payload.content!.social_id;            
          }
        } else {
          state.social.errorMessage = ('errors' in action.payload && Array.isArray(action.payload.errors))?action.payload.errors[0].msg:action.payload.message;
        }
      })
      .addCase(changeSocialCode.rejected, (state, action) => {
        state.social.isLoading = false;
        state.social.errorMessage = action.payload as string;
      }) 
      .addCase(registerSocial.pending, (state) => {
        state.socialRegistration.registrationIsLoading = true;
        state.socialRegistration.registrationSuccessMessage = '';
        state.socialRegistration.registrationErrorMessage = '';
      })
      .addCase(registerSocial.fulfilled, (state, action) => {
        state.socialRegistration.registrationIsLoading = false;
        if ( action.payload.success ) {
          state.socialRegistration.registrationSuccessMessage = action.payload.message;  
        } else {
          state.socialRegistration.registrationErrorMessage = ('errors' in action.payload && Array.isArray(action.payload.errors))?action.payload.errors[0].msg:action.payload.message;
        }
      })
      .addCase(registerSocial.rejected, (state, action) => {
        state.socialRegistration.registrationIsLoading = false;
        state.socialRegistration.registrationErrorMessage = action.payload as string;
      })                 
    },
});

// Get actions and reducer from the slice
const { reducer } = authSlice;

// Export the reset state reducer
export const { resetState, setLoginErrorMessage } = authSlice.actions;

//Export the reducer
export default reducer;