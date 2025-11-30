import { toast } from "react-toastify";

export const successToast = (msg: string) =>
  toast.success(msg, {
    position: "top-right",
    theme: "dark",
    style: {
      background: "#1c1c1c",
      color: "#fdd18e",
      borderLeft: "5px solid #c0392b",
      fontWeight: "600",
    },
  });

export const errorToast = (msg: string) =>
  toast.error(msg, {
    position: "top-right",
    theme: "dark",
    style: {
      background: "#1c1c1c",
      color: "#f6f2ee",
      borderLeft: "5px solid #c0392b",
      fontWeight: "600",
    },
  });
