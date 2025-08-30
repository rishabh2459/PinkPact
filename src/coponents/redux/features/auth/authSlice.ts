import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../../../api/apiServices';
// import { auth, db } from '@/firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
// import { doc, setDoc, getDoc } from 'firebase/firestore';

// Types
interface AuthState {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

// Async thunks
// export const registerUser = createAsyncThunk(
//   'auth/register',
//   async (userData: { email: string; password: string; first_name: string; last_name: string; country_id: string }, { rejectWithValue }) => {
//     try {
//       // 1. Create user in Firebase Auth
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         userData.email,
//         userData.password
//       );
//       const user = userCredential.user;
//       // 2. Optionally update displayName
//       await updateProfile(user, {
//         displayName: `${userData.first_name} ${userData.last_name}`
//       });
//       // 3. Store additional user info in Firestore
//       await setDoc(doc(db, 'users', user.uid), {
//         uid: user.uid,
//         email: user.email,
//         first_name: userData.first_name,
//         last_name: userData.last_name,
//         country_id: userData.country_id,
//         createdAt: new Date().toISOString(),
//       });
//       // 4. Store user in your backend DB
//       let backendResponse = null;
//       try {
//         backendResponse = await apiService.post('/auth/register', userData);
//       } catch (apiError: any) {
//         // Optionally handle backend error, but don't block Firebase registration
//         console.error('Backend registration failed:', apiError);
//       }
//       return {
//         user: { ...user, ...userData },
//         token: await user.getIdToken(),
//         backend: backendResponse ? backendResponse.data : null
//       };
//     } catch (error: any) {
//       return rejectWithValue(error.message || 'Registration failed');
//     }
//   }
// );

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // const userCredential = await signInWithEmailAndPassword(
      //   // auth,
      //   credentials.email,
      //   credentials.password
      // );
      // const user = userCredential.user;

      // const userDocRef = doc(db, 'users', user.uid);
      // const userDoc = await getDoc(userDocRef);

      // if (!userDoc.exists()) {
      //   return rejectWithValue('User data not found.');
      // }

      // const token = await user.getIdToken();
      // return {token}

      // return { user: userDoc.data(), token };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// export const fetchCountries = createAsyncThunk(
//     'reference/countries',
//     async (_, { rejectWithValue }) => {
//       try {
//         const response = await apiService.get('/reference/countries');
//         return response.data;
//       } catch (error: any) {
//         console.error('API Error:', error);
//         return rejectWithValue(error.response?.data?.message || 'Cannot fetch countries');
//       }
//     }
//   );

//   export const fetchNotificationSetting = createAsyncThunk(
//     'settings/notification',
//     async (_, { rejectWithValue }) => {
//       try {
//         const response = await apiService.get('/settings/notification');
//         return response.data;

//       } catch (error: any) {
//         console.error('API Error:', error);
//         return rejectWithValue(error.response?.data?.message || 'Cannot fetch countries');
//       }
//     }
//   );

//   export const updateNotificationSetting = createAsyncThunk(
//     'settings/notification',
//     async (data: any, { rejectWithValue }) => {

//       try {
//         const response = await apiService.put('/settings/notification', data);
//         return response.data;

//       } catch (error: any) {
//         console.error('API Error:', error);
//         return rejectWithValue(error.response?.data?.message || 'Cannot fetch countries');
//       }
//     }
//   );

//   export const fetchSessionTimeout = createAsyncThunk(
//     'settings/session_timeout',
//     async (_, { rejectWithValue }) => {
//       try {
//         const response = await apiService.get('/settings/session_timeout');
//         return response.data;

//       } catch (error: any) {
//         console.error('API Error:', error);
//         return rejectWithValue(error.response?.data?.message || 'Cannot fetch countries');
//       }
//     }
//   );

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      // .addCase(registerUser.pending, (state) => {
      //   state.isLoading = true;
      //   state.error = null;
      // })
      // .addCase(registerUser.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.user = action.payload.user;
      //   state.token = action.payload.token;
      // })
      // .addCase(registerUser.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error = action.payload as string;
      // })
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 