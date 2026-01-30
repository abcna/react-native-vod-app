import axios from "axios";

const API_BASE_URL = "https://api.example.com"; // Replace with your actual API URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const videoService = {
  async getSeriesList() {
    try {
      const response = await apiClient.get("/series");
      return response.data;
    } catch (error) {
      console.error("Error fetching series:", error);
      throw error;
    }
  },

  async getSeriesDetails(seriesId: string) {
    try {
      const response = await apiClient.get(`/series/${seriesId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching series ${seriesId}:`, error);
      throw error;
    }
  },

  async getEpisode(episodeId: string) {
    try {
      const response = await apiClient.get(`/episodes/${episodeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching episode ${episodeId}:`, error);
      throw error;
    }
  },
};

export default apiClient;
