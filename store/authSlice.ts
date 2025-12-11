import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Types
interface LoginCredentials {
  username: string;
  password: string;
  grant_type?: string;
  scope?: string;
  client_id?: string;
  client_secret?: string;
}

interface SignupCredentials {
  email: string;
  full_name: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  full_name?: string;
  name?: string;
  role?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: typeof window !== "undefined" ? localStorage.getItem("access_token") : null,
  user: null,
  loading: false,
  error: null,
};

// API Base URL - adjust if needed
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://km-backend-yj1m.onrender.com";

// Login async thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      // Convert to URL-encoded format
      const formData = new URLSearchParams();
      formData.append("grant_type", credentials.grant_type || "password");
      formData.append("username", credentials.username);
      formData.append("password", credentials.password);
      if (credentials.scope) formData.append("scope", credentials.scope);
      if (credentials.client_id) formData.append("client_id", credentials.client_id);
      if (credentials.client_secret) formData.append("client_secret", credentials.client_secret);

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Login failed" }));
        return rejectWithValue(errorData);
      }

      // Get response as text first to check format
      const responseText = await response.text();
      let token: string;

      // Try to parse as JSON if it looks like JSON
      if (responseText.trim().startsWith("{") || responseText.trim().startsWith("[")) {
        try {
          const data = JSON.parse(responseText);
          token = data.access_token || data.token || data.accessToken || data;
          // If token is still an object, it's not what we want
          if (typeof token !== "string") {
            // If the whole response is the token (unlikely but handle it)
            token = responseText;
          }
        } catch (e) {
          // Not valid JSON, treat as plain text token
          token = responseText;
        }
      } else {
        // Plain text token
        token = responseText;
      }

      // Trim any whitespace and remove quotes if present
      token = token.trim().replace(/^["']|["']$/g, "");

      // Validate token is not empty
      if (!token) {
        throw new Error("Received empty token from server");
      }

      // Log for debugging (remove in production)
      console.log("Login successful, token received (first 20 chars):", token.substring(0, 20) + "...");
      console.log("Token length:", token.length);

      return token;
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

// Signup async thunk
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (credentials: SignupCredentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Signup failed" }));
        return rejectWithValue(errorData);
      }

      const user = await response.json();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || "Signup failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    },
    setToken: (state, action: PayloadAction<string>) => {
      // Clean the token before storing
      const cleanToken = action.payload.trim().replace(/^["']|["']$/g, "");
      state.token = cleanToken;
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", cleanToken);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure token is a clean string
        const cleanToken = typeof action.payload === "string" 
          ? action.payload.trim().replace(/^["']|["']$/g, "")
          : String(action.payload).trim().replace(/^["']|["']$/g, "");
        state.token = cleanToken;
        state.error = null;
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", cleanToken);
          console.log("Token stored in localStorage:", cleanToken.substring(0, 20) + "...");
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? typeof action.payload === "string"
            ? action.payload
            : JSON.stringify(action.payload)
          : "Login failed";
      });

    // Signup
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? typeof action.payload === "string"
            ? action.payload
            : JSON.stringify(action.payload)
          : "Signup failed";
      });
  },
});

export const { logout, clearError, setToken } = authSlice.actions;
export default authSlice.reducer;

