import { useContext } from "react";
import { Sun, Moon, Sparkles } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

export default function TopBar() {
  const { dark, setDark } = useContext(ThemeContext);

  return (
    <header className="fixed top-6 right-8 z-30">
      <button
        onClick={() => setDark(!dark)}
        className="
          flex items-center gap-2
          bg-white/70 dark:bg-black/60
          backdrop-blur-xl
          border border-white/20
          px-4 py-2 rounded-full
          shadow-lg
          text-sm
          hover:scale-105 transition
        "
      >
        {dark ? <Sun size={16} /> : <Moon size={16} />}
        <span>{dark ? "Light" : "Dark"}</span>
      </button>
    </header>
  );
}
