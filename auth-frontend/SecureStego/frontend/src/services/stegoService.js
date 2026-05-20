import API from "./api.js";

export const stegoService = {
  /**
   * Hide a secret image inside a cover image.
   * Returns: { stegoBlob, metadata }
   *
   * The backend sends the stego image as PNG body, and metadata
   * as JSON in the X-SecureStego-Metadata response header.
   */
  hideImage: async ({ coverFile, secretFile, passphrase, onProgress }) => {
    const formData = new FormData();
    formData.append("cover", coverFile);
    formData.append("secret", secretFile);
    formData.append("passphrase", passphrase);

    const response = await API.post("/stego/hide", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      responseType: "blob",
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          const percent = Math.round((e.loaded * 100) / e.total);
          onProgress(percent);
        }
      },
    });

    // Extract metadata from response header
    const metadataHeader =
      response.headers["x-securestego-metadata"] ||
      response.headers["X-SecureStego-Metadata"];

    let metadata = null;
    if (metadataHeader) {
      try {
        metadata = JSON.parse(metadataHeader);
      } catch (e) {
        console.warn("Failed to parse metadata header:", e);
      }
    }

    return {
      stegoBlob: response.data,
      metadata,
    };
  },

  /**
   * Reveal a secret image from a stego image.
   * Returns: { secretBlob, metadata }
   */
  revealImage: async ({ stegoFile, passphrase, onProgress }) => {
    const formData = new FormData();
    formData.append("stego", stegoFile);
    formData.append("passphrase", passphrase);

    const response = await API.post("/stego/reveal", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      responseType: "blob",
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          const percent = Math.round((e.loaded * 100) / e.total);
          onProgress(percent);
        }
      },
    });

    const metadataHeader =
      response.headers["x-securestego-metadata"] ||
      response.headers["X-SecureStego-Metadata"];

    let metadata = null;
    if (metadataHeader) {
      try {
        metadata = JSON.parse(metadataHeader);
      } catch (e) {
        console.warn("Failed to parse metadata header:", e);
      }
    }

    return {
      secretBlob: response.data,
      metadata,
    };
  },
};