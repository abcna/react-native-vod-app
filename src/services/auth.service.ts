import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL = "https://api.example.com"; // Replace with your actual API URL
const AUTH_TOKEN_KEY = "auth_token";

const authClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to include auth token
authClient.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn("Could not retrieve auth token:", error);
  }
  return config;
});

export const authService = {
  async login(email: string, password: string) {
    try {
      const response = await authClient.post("/auth/login", {
        email,
        password,
      });
      if (response.data.token) {
        await SecureStore.setItemAsync(AUTH_TOKEN_KEY, response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  async register(email: string, password: string, name: string) {
    try {
      const response = await authClient.post("/auth/register", {
        email,
        password,
        name,
      });
      if (response.data.token) {
        await SecureStore.setItemAsync(AUTH_TOKEN_KEY, response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  async logout() {
    try {
      await authClient.post("/auth/logout");
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear token even if API call fails
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    }
  },

  async getAuthToken() {
    try {
      return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    } catch (error) {
      console.warn("Error retrieving auth token:", error);
      return null;
    }
  },
};

export default authClient;
