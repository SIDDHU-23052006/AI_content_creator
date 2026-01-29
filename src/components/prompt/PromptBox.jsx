import { useState, useEffect, useRef } from "react";
import { Send, Paperclip, ChevronDown, ChevronUp } from "lucide-react";
import { generateContent } from "../../services/aiService";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Check, Zap } from "lucide-react";

export default function PromptBox({
  selectedType,
  reuseParams,
  chatId,          // 🔥 active chat
  onClearType,
  onSubmit,        // 🔥 user prompt + meta
  onResult,        // AI response
setActiveChatId,
isNewSession,
setIsNewSession,
onOpenVariations,
selectedVariation,
setBatchMode,
}) {
  const variationRef = useRef(null);
const [mode, setMode] = useState("chat"); // "chat" | "batch"

  const [variationOpen, setVariationOpen] = useState(false);
const [variations, setVariations] = useState([]);
const [loadingVariations, setLoadingVariations] = useState(false);

  const [model, setModel] = useState("gpt-3.4");
  const [modelOpen, setModelOpen] = useState(false);

  const [showOptions, setShowOptions] = useState(false);
  const [prompt, setPrompt] = useState("");

  const [tone, setTone] = useState("");
  const [audience, setAudience] = useState("");
  const [keywords, setKeywords] = useState("");
  const [length, setLength] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const close = () => setModelOpen(false);
  window.addEventListener("click", close);
  return () => window.removeEventListener("click", close);
}, []);
useEffect(() => {
  setBatchMode?.(mode === "batch");
}, [mode]);

useEffect(() => {
  const handleClickOutside = (e) => {
    if (
      variationRef.current &&
      !variationRef.current.contains(e.target)
    ) {
      setVariationOpen(false);
    }
  };

  if (variationOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [variationOpen]);


  /* ================= 🔁 REUSE FROM HISTORY ================= */
  useEffect(() => {
    if (reuseParams) {
      setPrompt(reuseParams.topic || "");
      setTone(reuseParams.tone || "Professional");
      setAudience(reuseParams.audience || "");
      setKeywords(reuseParams.keywords || "");
      setLength(reuseParams.length || "Medium");
      setShowOptions(true);
    }
  }, [reuseParams]);

  /* ================= 🚀 GENERATE ================= */
  const handleGenerate = async () => {
    if (mode === "batch") {
  // later: open batch UI / CSV upload / multi-input panel
  console.log("Batch mode active");
  return;
}

    if (!prompt.trim() || !selectedType || loading) return;

    const userPrompt = prompt.trim();

    /* 🔥 1. SEND USER PROMPT + PREFERENCES */
    onSubmit?.(userPrompt, {
      tone,
      audience,
      keywords,
      length,
    });

    setPrompt("");
    setLoading(true);

    try {
      const result = await generateContent({
  chatId: isNewSession ? null : chatId,
  type: selectedType,
  topic: userPrompt,
  tone,
  audience,
  keywords,
  length,
  model,
  lockedVariationHint: selectedVariation
    ? `Use this variation as inspiration:\n${selectedVariation}`
    : "",
});



      /* 🔥 2. SEND AI RESPONSE */
      onResult?.(
        typeof result?.content === "string" && result.content.trim()
          ? result.content
          : "No content generated."
      );
      if (isNewSession && result?.chatId) {
  setActiveChatId(result.chatId);
  setIsNewSession(false);
}

    } catch (error) {
      console.error("Generation error:", error);
      onResult?.("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div
        className="
          bg-gray-200/85 dark:bg-zinc-900/80
          backdrop-blur-xl
          border border-black/10 dark:border-white/10
          rounded-2xl
          shadow-[0_20px_50px_rgba(0,0,0,0.25)]
          p-6
        "
      >
        {/* ================= PROMPT INPUT ================= */}
        <textarea
          rows={2}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            selectedType
              ? `What should this ${selectedType} be about?`
              : "Choose a content type to get started..."
          }
          className="
            w-full resize-none
            bg-transparent
            text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-white/40
            focus:outline-none
            text-lg
          "
        />

        {/* ================= TYPE + OPTIONS ================= */}
        {selectedType && (
          <div className="flex items-center justify-between mt-4">
            <span
              onClick={onClearType}
              title="Change content type"
              className="
                cursor-pointer
                px-3 py-1 text-sm rounded-full
                bg-purple-600/15 text-purple-600
                dark:bg-purple-600/20 dark:text-purple-300
                hover:bg-purple-600/30 transition
              "
            >
              {selectedType}
            </span>

            <button
              onClick={() => setShowOptions(!showOptions)}
              className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400"
            >
              {showOptions ? "Hide options" : "Show options"}
              {showOptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        )}

        {/* ================= OPTIONS ================= */}
        {showOptions && selectedType && (
          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tone */}
              <div>
                <label className="text-xs text-gray-500 dark:text-white/50">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-900 border"
                >
                  <option>Select Tone</option>
                  <option>Professional</option>
                  <option>Casual</option>
                  <option>Friendly</option>
                  <option>Persuasive</option>
                </select>
              </div>
            
              {/* Audience */}
              <div>
                <label className="text-xs text-gray-500 dark:text-white/50">
                  Audience
                </label>
                <input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. Students, CEOs"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-900 border"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="text-xs text-gray-500 dark:text-white/50">
                  Keywords
                </label>
                <input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Comma separated"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-900 border"
                />
              </div>
            </div>

            {/* Length */}
            <div>
              <label className="text-xs text-gray-500 dark:text-white/50">
                Content Length
              </label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-900 border"
              >
                <option>Choose length</option>
                <option value="Short">Short</option>
                <option value="Medium">Medium</option>
                <option value="Long">Long</option>
              </select>
            </div>
          </div>
          
        )}

        {/* ================= FOOTER ================= */}
        {/* ================= FOOTER ================= */}
<div className="flex items-center justify-between mt-6">

  {/* LEFT: ATTACH */}
<div className="flex items-center gap-4">

  {/* ATTACH */}
  <button className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
    <Paperclip size={18} /> Attach
  </button>

  {/* CHAT / BATCH TOGGLE */}
  <div className="flex bg-black/5 dark:bg-white/10 rounded-full p-1">
    <button
      onClick={() => setMode("chat")}
      className={`px-3 py-1.5 text-xs rounded-full transition
        ${
          mode === "chat"
            ? "bg-purple-600 text-white"
            : "text-gray-500 dark:text-white/60 hover:text-purple-500"
        }`}
    >
      Chat
    </button>

    <button
      onClick={() => setMode("batch")}
      className={`px-3 py-1.5 text-xs rounded-full transition
        ${
          mode === "batch"
            ? "bg-purple-600 text-white"
            : "text-gray-500 dark:text-white/60 hover:text-purple-500"
        }`}
    >
      Batch
    </button>
  </div>

</div>



  {/* RIGHT: MODEL + SEND */}
  <div className="relative flex items-center gap-3">

  {/* ⚡ VARIATION BUTTON */}
  <button
    type="button"
    onClick={async (e) => {
      e.stopPropagation();
      if (!prompt.trim() || !selectedType) return;

      setVariationOpen(prev => !prev);

      if (variations.length === 0) {
        setLoadingVariations(true);

        const result = await generateContent({
          chatId: null,
          type: selectedType,
          topic: prompt,
          tone,
          audience,
          keywords,
          length,
          model,
          variationMode: true,
        });

        const parts =
          typeof result?.content === "string"
            ? result.content
                .split(/===\s*VARIATION\s*[A-Z]\s*===/i)
                .map(v => v.trim())
                .filter(v => v.length > 40)
            : [];

        setVariations(parts);
        setLoadingVariations(false);
      }
    }}
    className="p-2 rounded-full bg-yellow-400/20 text-yellow-500 hover:bg-yellow-400 hover:text-black transition"
  >
    <Zap size={18} />
  </button>

  {/* ✅ VARIATION DROPDOWN */}
  <AnimatePresence>
    {variationOpen && (
      <motion.div
        ref={variationRef}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="
          absolute bottom-12 right-0
          w-80 max-h-72 overflow-y-auto
          rounded-xl
          bg-white dark:bg-[#0b0c10]
          border border-black/10 dark:border-white/10
          shadow-2xl z-50
        "
      >
        {loadingVariations ? (
          <p className="text-center text-sm py-6 opacity-60">
            Generating variations…
          </p>
        ) : variations.length === 0 ? (
          <p className="text-center text-sm py-6 opacity-60">
            No variations found
          </p>
        ) : (
          variations.map((v, i) => (
            <button
              key={i}
              onClick={() => {
                onResult?.(v);
                setVariationOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-purple-600/10 border-b last:border-none"
            >
              {v.slice(0, 120)}…
            </button>
          ))
        )}
      </motion.div>
    )}
  </AnimatePresence>

    {/* MODEL SELECTOR */}
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setModelOpen(!modelOpen);
        }}
        className="
          flex items-center gap-2
          px-3 py-1.5
          rounded-lg
          text-xs font-medium
          text-gray-600 dark:text-gray-300
          bg-black/5 dark:bg-white/5
          hover:bg-purple-600/10
          transition
        "
      >
        <Cpu size={14} className="text-purple-500" />
        {model === "gpt-3.4"
          ? "GPT-3.4"
          : model === "flash-2.5"
          ? "Flash 2.5"
          : "Mistral"}
      </button>

      {/* DROPDOWN */}
      <AnimatePresence>
        {modelOpen && (
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="
              absolute bottom-12 right-0
              w-44 rounded-xl
              bg-white dark:bg-[#0b0c10]
              border border-black/10 dark:border-white/10
              shadow-2xl overflow-hidden z-50
            "
          >
            {[
              { id: "gpt-3.4", label: "GPT-3.4", sub: "OpenAI" },
              { id: "flash-2.5", label: "Flash 2.5", sub: "Gemini" },
              { id: "mistral", label: "Mistral", sub: "HuggingFace" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setModel(item.id);
                  setModelOpen(false);
                }}
                className="
                  w-full px-4 py-3 text-left
                  flex items-center justify-between
                  hover:bg-purple-600/10 transition
                "
              >
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs opacity-60">{item.sub}</p>
                </div>
                {model === item.id && (
                  <Check size={16} className="text-purple-600" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* SEND BUTTON */}
    <button
      onClick={handleGenerate}
      disabled={loading || !selectedType || !prompt.trim()}
      className="
        bg-purple-600 p-3 rounded-full text-white
        hover:scale-110 transition
        disabled:opacity-40 disabled:cursor-not-allowed
      "
    >
      <Send size={18} />
    </button>

  </div>
      </div>
    </div>
    </div>
  );
}
