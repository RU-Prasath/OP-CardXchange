import { toast, type ToastOptions } from "react-toastify";

const toastConfig: ToastOptions = {
  position: "top-right",
  theme: "dark",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const customToast = {
  success: (msg: string) =>
    toast.success(msg, {
      ...toastConfig,
      style: {
        background: "#1c1c1c",
        color: "#fdd18e",
        borderLeft: "5px solid #27ae60",
        fontWeight: "600",
      },
    }),

  error: (msg: string) =>
    toast.error(msg, {
      ...toastConfig,
      style: {
        background: "#1c1c1c",
        color: "#f6f2ee",
        borderLeft: "5px solid #c0392b",
        fontWeight: "600",
      },
    }),

  warning: (msg: string) =>
    toast.warning(msg, {
      ...toastConfig,
      style: {
        background: "#1c1c1c",
        color: "#f6f2ee",
        borderLeft: "5px solid #f39c12",
        fontWeight: "600",
      },
    }),

  info: (msg: string) =>
    toast.info(msg, {
      ...toastConfig,
      style: {
        background: "#1c1c1c",
        color: "#f6f2ee",
        borderLeft: "5px solid #3498db",
        fontWeight: "600",
      },
    }),
};