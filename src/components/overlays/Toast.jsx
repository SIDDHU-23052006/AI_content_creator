import { useEffect } from "react";

export default function Toast({
  show,
  message,
  type = "success",
  duration = 2500,
  onClose,
}) {
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div
  className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full text-white
  ${type === "error" ? "bg-red-600" : "bg-green-600"}`}
>
  {message}
</div>

  );
}
