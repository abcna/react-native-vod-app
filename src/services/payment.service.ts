import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL = "https://api.example.com"; // Replace with your actual API URL
const AUTH_TOKEN_KEY = "auth_token";

const paymentClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to include auth token
paymentClient.interceptors.request.use(async (config) => {
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

export const paymentService = {
  async purchaseCoins(packageId: string, amount: number) {
    try {
      const response = await paymentClient.post("/purchases/coins", {
        packageId,
        amount,
      });
      return response.data;
    } catch (error) {
      console.error("Error purchasing coins:", error);
      throw error;
    }
  },

  async getPackages() {
    try {
      const response = await paymentClient.get("/packages/coins");
      return response.data;
    } catch (error) {
      console.error("Error fetching coin packages:", error);
      throw error;
    }
  },

  async getTransactionHistory() {
    try {
      const response = await paymentClient.get("/transactions");
      return response.data;
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      throw error;
    }
  },

  // Secure storage for auth token
  async saveAuthToken(token: string) {
    try {
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    } catch (error) {
      console.error("Error saving auth token:", error);
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

  async clearAuthToken() {
    try {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error("Error clearing auth token:", error);
    }
  },
};

export default paymentClient;
