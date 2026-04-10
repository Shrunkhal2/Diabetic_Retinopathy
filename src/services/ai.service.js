import api from "./api";

export const predictImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.post("/ai/predict", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};