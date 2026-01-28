import Swal from "sweetalert2";

const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1600,
  timerProgressBar: true,
  background: "#F6F1E8",
  color: "#1E1E1E",
});

export const toastSuccess = (title: string) => toast.fire({ icon: "success", title });
export const toastError = (title: string) => toast.fire({ icon: "error", title });
export const toastInfo = (title: string) => toast.fire({ icon: "info", title });
