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

// export const loginUser = async (email, password) => {
//   try {
//     const res = await api.post("/api/auth/login", { email, password });
//     saveToken(res.data.access_token);
//     return res.data;   // { access_token, role }
//   } catch (err) {
//     throw new Error(err.response?.data?.detail || "Invalid credentials");
//   }
// };

export const loginUser = async (email, password) => {
  let role = null;

  if (email === "admin@test.com" && password === "1234") {
    role = "ADMIN";
  } else if (email === "agent@test.com" && password === "1234") {
    role = "DELIVERY_AGENT";
  } else if (email === "client@test.com" && password === "1234") {
    role = "BUSINESS_CLIENT";
  } else {
    throw new Error("Invalid credentials");
  }

  const fakeToken = "demo-token-123";

  const user = { email, role };
  localStorage.setItem("user", JSON.stringify(user));

  saveToken(fakeToken);

  return {
    access_token: fakeToken,
    role: role
  };
};

// export const getCurrentUser = async () => {
//   const token = getToken();
//   if (!token) return null;
//   try {
//     const res = await api.get("/api/auth/me");
//     return res.data;
//   } catch {
//     removeToken();
//     return null;
//   }
// };

export const getCurrentUser = async () => {
  const token = getToken();
  if (!token) return null;

  const user = JSON.parse(localStorage.getItem("user"));

  return user || {
    email: "demo@test.com",
    role: "ADMIN"
  };
};

export const updateProfile = async (formData) => {
  try {
    const res = await api.patch("/api/auth/me", formData);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.detail || "Failed to update profile");
  }
};

// export const logoutUser = () => removeToken();

export const logoutUser = () => {
  removeToken();
  localStorage.removeItem("user");
};