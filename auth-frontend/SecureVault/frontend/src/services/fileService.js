import API from "./api.js";

export const fileService = {
  uploadFile: async (file, onProgress) => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await API.post("/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          const percent = Math.round((e.loaded * 100) / e.total);
          onProgress(percent);
        }
      },
    });
    return data;
  },

  getMyFiles: async () => {
    const { data } = await API.get("/files");
    return data;
  },

  getSharedWithMe: async () => {
    const { data } = await API.get("/files/shared/with-me");
    return data;
  },

  getStats: async () => {
    const { data } = await API.get("/files/stats");
    return data;
  },

  downloadFile: async (fileId, password) => {
    const response = await API.post(
      `/files/${fileId}/download`,
      { password },
      { responseType: "blob" }
    );
    return response;
  },

  previewFile: async (fileId, password) => {
    const response = await API.post(
      `/files/${fileId}/preview`,
      { password },
      { responseType: "blob" }
    );
    return response;
  },

  shareFile: async (fileId, password, recipientEmail) => {
    const { data } = await API.post(`/files/${fileId}/share`, {
      password,
      recipientEmail,
    });
    return data;
  },

  getFileShares: async (fileId) => {
    const { data } = await API.get(`/files/${fileId}/shares`);
    return data;
  },

  revokeShare: async (fileId, userId) => {
    const { data } = await API.delete(`/files/${fileId}/share/${userId}`);
    return data;
  },

  deleteFile: async (fileId) => {
    const { data } = await API.delete(`/files/${fileId}`);
    return data;
  },
};