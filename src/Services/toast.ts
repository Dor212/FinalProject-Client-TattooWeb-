import Swal from "sweetalert2";

type ToastKind = "success" | "error" | "warning" | "info";

const COLORS = {
  bg: "#F6F1E8",
  fg: "#1E1E1E",
  line: "#E8D9C2",
  accent: "#B9895B",
  danger: "#B23A3A",
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function getNested(obj: unknown, key: string): unknown {
  if (!isRecord(obj)) return undefined;
  return obj[key];
}

function getString(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

const ToastBase = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
  background: COLORS.bg,
  color: COLORS.fg,
  iconColor: COLORS.accent,
  customClass: {
    popup: "omer-toast",
    title: "omer-toast-title",
    htmlContainer: "omer-toast-html",
    timerProgressBar: "omer-toast-progress",
  },
  didOpen: (toastEl) => {
    toastEl.addEventListener("mouseenter", Swal.stopTimer);
    toastEl.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

function fireToast(kind: ToastKind, title: string, text?: string, durationMs?: number) {
  const hasDuration = typeof durationMs === "number";
  const timer = hasDuration ? (durationMs > 0 ? durationMs : undefined) : undefined;
  const timerProgressBar = hasDuration ? durationMs > 0 : undefined;

  return ToastBase.fire({
    icon: kind,
    title,
    text,
    timer,
    timerProgressBar,
  });
}

export const toast = {
  success: (title: string, text?: string, durationMs?: number) => fireToast("success", title, text, durationMs),
  error: (title: string, text?: string, durationMs?: number) => fireToast("error", title, text, durationMs),
  warning: (title: string, text?: string, durationMs?: number) => fireToast("warning", title, text, durationMs),
  info: (title: string, text?: string, durationMs?: number) => fireToast("info", title, text, durationMs),
};

export const dialog = {
  alert: (opts: { title: string; text?: string; icon?: ToastKind }) =>
    Swal.fire({
      icon: opts.icon ?? "info",
      title: opts.title,
      text: opts.text,
      background: COLORS.bg,
      color: COLORS.fg,
      confirmButtonText: "סבבה",
      customClass: {
        popup: "omer-dialog",
        title: "omer-dialog-title",
        htmlContainer: "omer-dialog-html",
        confirmButton: "omer-dialog-confirm",
      },
      buttonsStyling: false,
    }),

  confirm: async (opts: {
    title: string;
    text?: string;
    confirmText?: string;
    cancelText?: string;
    icon?: ToastKind;
  }) => {
    const res = await Swal.fire({
      icon: opts.icon ?? "warning",
      title: opts.title,
      text: opts.text,
      background: COLORS.bg,
      color: COLORS.fg,
      showCancelButton: true,
      confirmButtonText: opts.confirmText ?? "כן",
      cancelButtonText: opts.cancelText ?? "ביטול",
      customClass: {
        popup: "omer-dialog",
        title: "omer-dialog-title",
        htmlContainer: "omer-dialog-html",
        confirmButton: "omer-dialog-confirm",
        cancelButton: "omer-dialog-cancel",
      },
      buttonsStyling: false,
    });
    return Boolean(res.isConfirmed);
  },
};

export function getHttpErrorMessage(err: unknown, fallback = "משהו השתבש") {
  const message = getString(getNested(err, "message"));
  if (message) return message;

  const response = getNested(err, "response");
  const data = getNested(response, "data");

  const dataAsString = getString(data);
  if (dataAsString) return dataAsString;

  const dataMessage = getString(getNested(data, "message"));
  if (dataMessage) return dataMessage;

  return fallback;
}
