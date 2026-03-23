import api from "./api";

export const saveToken = (token) => localStorage.setItem("access_token", token);
export const getToken = () => localStorage.getItem("access_token");
export const removeToken = () => localStorage.removeItem("access_token");

export const registerUser = async (formData) => {
  try {
    const res = await api.post("/api/auth/register", formData);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.detail || "Registration failed");
  }
};

export const loginUser = async (email, password) => {
  try {
    const res = await api.post("/api/auth/login", { email, password });
    saveToken(res.data.access_token);
    return res.data;   // { access_token, role }
  } catch (err) {
    throw new Error(err.response?.data?.detail || "Invalid credentials");
  }
};

export const getCurrentUser = async () => {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await api.get("/api/auth/me");
    return res.data;
  } catch {
    removeToken();
    return null;
  }
};

export const updateProfile = async (formData) => {
  try {
    const res = await api.patch("/api/auth/me", formData);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.detail || "Failed to update profile");
  }
};

export const logoutUser = () => removeToken();