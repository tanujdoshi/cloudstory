// src/api.js
import axios from "axios";

let api;

export const initializeApi = async () => {
  try {
    const url = process.env.REACT_APP_BASE_URL;
    api = axios.create({
      baseURL: url,
      headers: {
        "Content-Type": "application/json",
      },
    });
    api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  } catch (error) {
    console.error("Error initializing API:", error);
    throw error;
  }
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post("/api/stories/uploadToS3", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const saveStory = async (formData) => {
  try {
    const response = await api.post("/api/stories/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error saving story:", error);
    throw error;
  }
};

export const getStories = async () => {
  try {
    const response = await api.get("/api/stories/");
    return response.data;
  } catch (error) {
    console.error("Error saving story:", error);
    throw error;
  }
};

export const storyDetail = async (body) => {
  try {
    const response = await api.post(`/api/stories/${body.id}`, body);
    return response.data;
  } catch (error) {
    console.error("Error getting story:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const login = async (body) => {
  try {
    const response = await api.post("/api/users/login", body);
    const { token } = response.data;
    localStorage.setItem("token", token);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const register = async (body) => {
  try {
    const response = await api.post("/api/users/signup", body);
    console.log("Registereddddd?");
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const convertToSpeech = async (id, body) => {
  try {
    const response = await api.post(
      `/api/stories/convert-to-speech/${id}`,
      body,
      {
        responseType: "blob",
      }
    );
    return await response.data;
  } catch (error) {
    console.error("Error converting speech:", error);
    throw error;
  }
};

export const getLanguages = async () => {
  try {
    const response = await api.get(`/api/language/get`);
    console.log("response.data", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting languagess:", error);
    throw error;
  }
};

export default api;
