import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import TopBar from "../components/header/TopBar";
import PromptBox from "../components/prompt/PromptBox";
import ContentCards from "../components/prompt/ContentCards";
import HistoryPanel from "../components/history/HistoryPanel";
import Toast from "../components/overlays/Toast";
import Papa from "papaparse";
import { motion, AnimatePresence } from "framer-motion";
import { generateContent } from "../services/aiService";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  RotateCcw,
  Check,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

import { getChatById } from "../utils/historyStorage";
import { getWordCount, getReadabilityScore } from "../utils/textAnalytics";

export default function Home() {
  const [showVariations, setShowVariations] = useState(false);
const [variations, setVariations] = useState([]);
const [basePromptForVariations, setBasePromptForVariations] = useState(null);
const [selectedVariation] = useState(null); // 🔥 NEW

  // 🔥 Batch Mode
const [batchMode, setBatchMode] = useState(false);
const [batchInputs, setBatchInputs] = useState([]); // [{ id, text }]
const [batchResults, setBatchResults] = useState([]); // [{ id, status, output, error }]
const [batchProgress, setBatchProgress] = useState(0);
const [batchRunning, setBatchRunning] = useState(false);

  const [selectedType, setSelectedType] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [messages, setMessages] = useState([]);
  const [reuseParams, setReuseParams] = useState(null);

  const [copiedIndex, setCopiedIndex] = useState(null);
const [feedback, setFeedback] = useState(() => {
  return JSON.parse(localStorage.getItem("ai_feedback")) || {};
});
const navigate = useNavigate();
const [checkingAuth, setCheckingAuth] = useState(true);

const [feedbackAnim, setFeedbackAnim] = useState({});

const [activeChatId, setActiveChatId] = useState(null);
const [isNewSession, setIsNewSession] = useState(true);

  const hasMessages = messages.length > 0;
/* ================= DYNAMIC LOADING ================= */
const LOADING_STEPS = [
  { text: "Analyzing your prompt…", type: "spinner" },
  { text: "Thinking creatively…", type: "dots" },
  { text: "Structuring response…", type: "bar" },
  { text: "Finalizing output…", type: "pulse" },
];
const [showSuccessToast, setShowSuccessToast] = useState(false);

const [loadingStep, setLoadingStep] = useState(0);

  /* ================= THEME ================= */

useEffect(() => {
  const user = localStorage.getItem("user");

  // simulate auth check delay (UX polish)
  setTimeout(() => {
    if (!user) {
      navigate("/sign", { replace: true });
    } else {
      setCheckingAuth(false);
    }
  }, 800);
}, []);

/* ================= LOADING ANIMATION CYCLE ================= */
useEffect(() => {
  const hasLoading = messages.some(
    (m) => m.role === "assistant" && m.content === ""
  );

  if (!hasLoading) {
    setLoadingStep(0);
    return;
  }

  const interval = setInterval(() => {
    setLoadingStep((prev) => (prev + 1) % LOADING_STEPS.length);
  }, 5000);

  return () => clearInterval(interval);
}, [messages]);

  /* ================= LOAD CHAT ================= */
function handleSelectChat(chatId) {
  // ✅ NEW CHAT
if (!chatId) {
  setMessages([]);
  setSelectedType(null);
  setReuseParams(null);
  setActiveChatId(null);
  setIsNewSession(true);
  return;
}


  const chat = getChatById(chatId);
  if (!chat) return;

  setMessages(
    chat.messages.map((m) => ({
      role: m.role,
      content: m.content,
      meta: m.meta || null,
    }))
  );

  setSelectedType(chat.type || null);
  setReuseParams(null);
}


  /* ================= COPY ================= */
  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1200);
  };

  const formatLabel = (key) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

  const recordFeedback = (messageId, type, meta) => {
  const stored = JSON.parse(localStorage.getItem("ai_feedback")) || {};

  stored[messageId] = {
    type, // "up" | "down"
    contentType: meta?.type,
    timestamp: Date.now(),
  };

  localStorage.setItem("ai_feedback", JSON.stringify(stored));
  setFeedback(stored);
};
if (checkingAuth) {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0b0b14] text-white">
      <div className="flex gap-2 mb-4">
        <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" />
        <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-150" />
        <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-300" />
      </div>
      <p className="text-sm opacity-70">Preparing your workspace…</p>
    </div>
  );
}

  return (
    <div className="relative h-screen overflow-hidden bg-gray-100 dark:bg-black text-gray-900 dark:text-white">
      <Sidebar isOpen={sidebarOpen} onSelectChat={handleSelectChat} />
      
      {/* TOGGLE */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed top-6 z-50 w-10 h-10 rounded-full flex items-center justify-center
        bg-white dark:bg-black/70 backdrop-blur border border-black/10 dark:border-white/10
        ${sidebarOpen ? "left-[18rem]" : "left-[5.5rem]"}`}
      >
        {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>
      
          
      <main
        className={`relative h-full transition-all duration-300 ${
          sidebarOpen ? "ml-72" : "ml-20"
        }`}
      >
      
        {/* BG — UNCHANGED */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/bg.png')" }}
          />
          <div className="absolute inset-0 bg-white/85 dark:hidden" />
          <div className="absolute inset-0 hidden dark:block bg-black/65" />
        </div>
          
        <TopBar />

        {/* CHAT */}
        <div
  className={`relative z-10 pt-28 h-full
  ${hasMessages ? "overflow-y-auto" : "overflow-hidden"}`}
>

          <div className="max-w-4xl mx-auto px-6 pb-[420px] space-y-6">
            
            {!hasMessages && (
              <div className="text-center mb-24">
                <h1 className="text-5xl font-bold mb-4">
                  Hi Siddhu! <br />I’m your creative partner.
                </h1>
                <p className="max-w-xl mx-auto text-gray-600 dark:text-white/70 text-lg">
                  I help you write LinkedIn posts, emails, ad copy, and more.
                </p>
              </div>
            )}

            {!batchMode &&
  messages.map((msg, index) => {
    const isUser = msg.role === "user";

    return (
      <div
        key={index}
        className={`flex flex-col ${
          isUser ? "items-end" : "items-start"
        }`}
      >
                  <div
                    className={`max-w-3xl px-6 py-4 rounded-2xl backdrop-blur-xl border
                    ${
                      isUser
                        ? "bg-purple-600 text-white border-purple-500/40"
                        : "bg-white dark:bg-black/70 text-gray-800 dark:text-white border-black/10 dark:border-white/10"
                    }`}
                  >
                    {msg.content ? (
                      <>
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {msg.content}
                        </div>

                        {!isUser && (
                          <div className="flex gap-4 text-xs opacity-70 mt-3">
                            <span>{getWordCount(msg.content)} words</span>
                            <span>
                              Readability: {getReadabilityScore(msg.content)}/100
                            </span>
                          </div>
                        )}

                        {isUser && msg.meta && (
                          <div className="flex flex-wrap gap-2 mt-3 text-xs">
                            {Object.entries(msg.meta)
                              .filter(
                                ([k, v]) =>
                                  v && k !== "type" && k !== "topic"
                              )
                              .map(([k, v]) => (
                                <span
                                  key={k}
                                  className="px-2 py-1 rounded-full bg-white/20"
                                >
                                  {formatLabel(k)}: {String(v)}
                                </span>
                              ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-3 text-gray-500 dark:text-white/70">
  {/* ICON */}
  {LOADING_STEPS[loadingStep].type === "spinner" && (
    <span className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
  )}

  {LOADING_STEPS[loadingStep].type === "dots" && (
    <span className="flex gap-1">
      <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
      <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150" />
      <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-300" />
    </span>
  )}

  {LOADING_STEPS[loadingStep].type === "bar" && (
    <span className="w-24 h-1 bg-purple-500/20 rounded overflow-hidden">
      <span className="block h-full w-1/2 bg-purple-500 animate-pulse" />
    </span>
  )}

  {LOADING_STEPS[loadingStep].type === "pulse" && (
    <span className="w-3 h-3 bg-purple-500 rounded-full animate-ping" />
  )}

  {/* TEXT */}
  <span>{LOADING_STEPS[loadingStep].text}</span>
</div>

                    )}
                  </div>

                  {/* ACTIONS */}
                  {msg.content && (
                    <div className="mt-2 flex gap-4 text-xs opacity-70">
                      <button
                        onClick={() => handleCopy(msg.content, index)}
                        className="flex items-center gap-1"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check size={20} /> Copied
                          </>
                        ) : (
                          <>
                            <Copy size={20} />
                          </>
                        )}
                      </button>

                      {!isUser && (
                        <>
                          <button
  onClick={() => {
    setFeedbackAnim({ [msg.id]: "up" });
    recordFeedback(msg.id, "up", msg.meta);

    setTimeout(() => setFeedbackAnim({}), 600);
  }}
  className={`transition transform ${
    feedbackAnim[msg.id] === "up"
      ? "scale-125 text-green-500 animate-bounce"
      : "hover:scale-110"
  }`}
>
  <ThumbsUp size={20} />
</button>


<button
  onClick={() => {
    setFeedbackAnim({ [msg.id]: "down" });
    recordFeedback(msg.id, "down", msg.meta);

    setTimeout(() => setFeedbackAnim({}), 600);
  }}
  className={`transition transform ${
    feedbackAnim[msg.id] === "down"
      ? "scale-125 text-red-500 animate-pulse"
      : "hover:scale-110"
  }`}
>
  <ThumbsDown size={20} />
</button>



                          <button
                            onClick={() => {
                              const lastUser = [...messages]
                                .slice(0, index)
                                .reverse()
                                .find((m) => m.role === "user");
                              if (!lastUser) return;

                              setReuseParams({
                                topic: lastUser.content,
                                ...lastUser.meta,
                              });
                              setSelectedType(lastUser.meta?.type);
                            }}
                          >
                            <RotateCcw size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {batchMode && (
  <div className="max-w-4xl mx-auto px-6 pb-[420px] space-y-6">
    <div className="p-6 rounded-2xl bg-white dark:bg-black/70 border">
      <h2 className="text-lg font-semibold mb-4">
        Batch Content Generation
      </h2>

      <input
  type="file"
  accept=".csv"
  className="block w-full mb-4"
  onChange={(e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data
          .filter(r => r.prompt)
          .map((row, i) => ({
            id: i + 1,
            text: row.prompt,
          }));

        setBatchInputs(rows);
        setBatchResults([]);
        setBatchProgress(0);
      },
    });
  }}
/>
{batchInputs.length > 0 && (
  <>
    <button
      onClick={async () => {
        setBatchRunning(true);
        setBatchResults([]);
        setBatchProgress(0);

        for (let i = 0; i < batchInputs.length; i++) {
          const item = batchInputs[i];

          try {
            const result = await generateContent({
              chatId: null,
              type: selectedType,
              topic: item.text,
            });

            setBatchResults(prev => [
              ...prev,
              {
                id: item.id,
                status: "success",
                output: result.content,
              },
            ]);
          } catch (err) {
            setBatchResults(prev => [
              ...prev,
              {
                id: item.id,
                status: "error",
                error: "Generation failed",
              },
            ]);
          }

          setBatchProgress(Math.round(((i + 1) / batchInputs.length) * 100));
        }

        setBatchRunning(false);
      }}
      className="px-5 py-2 rounded-lg bg-purple-600 text-white hover:scale-105 transition"
    >
      Run Batch ({batchInputs.length})
    </button>

    {/* PROGRESS BAR */}
    {batchRunning && (
      <div className="mt-4">
        <div className="h-2 bg-gray-200 rounded overflow-hidden">
          <div
            className="h-full bg-purple-600 transition-all"
            style={{ width: `${batchProgress}%` }}
          />
        </div>
        <p className="text-xs mt-2 opacity-70">
          Processing… {batchProgress}%
        </p>
      </div>
    )}
  </>
)}


      <p className="text-sm opacity-70">
        Upload a CSV or switch to Chat mode for single prompts.
      </p>
    </div>
  </div>
)}
{batchResults.length > 0 && (
  <div className="mt-6 space-y-4">
    {batchResults.map((r) => (
      <div
        key={r.id}
        className={`p-4 rounded-xl border ${
          r.status === "success"
            ? "bg-green-50 dark:bg-green-900/20 border-green-500/30"
            : "bg-red-50 dark:bg-red-900/20 border-red-500/30"
        }`}
      >
        <p className="text-xs opacity-60 mb-1">
          Row {r.id} — {r.status}
        </p>

        {r.status === "success" ? (
          <p className="text-sm whitespace-pre-wrap">
            {r.output}
          </p>
        ) : (
          <p className="text-sm text-red-600">
            {r.error}
          </p>
        )}
      </div>
    ))}
  </div>
)}

        <HistoryPanel
          onReuse={(item) => {
            setSelectedType(item.type);
            setReuseParams(item.params);
          }}
        />
        
        {/* INPUT */}
        <div
          className={`fixed bottom-0 z-50 ${
            sidebarOpen ? "left-72" : "left-20"
          } right-0`}
        >
          <div className="max-w-4xl mx-auto px-6 pb-6 space-y-4">
            {!selectedType && <ContentCards onSelect={setSelectedType} />}

            <div className="bg-gray-200 dark:bg-black/80 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl">
              <PromptBox
                chatId={activeChatId}
  setActiveChatId={setActiveChatId}
  isNewSession={isNewSession}
  setIsNewSession={setIsNewSession}
                selectedType={selectedType}
                reuseParams={reuseParams}
                selectedVariation={selectedVariation}
                setBatchMode={setBatchMode}
                onClearType={() => {
                  setSelectedType(null);
                  setReuseParams(null);
                }}
                onOpenVariations={async (data) => {
  setShowVariations(true);
  setVariations([]);
  setBasePromptForVariations(data);

  const result = await generateContent({
    chatId: null,
    type: selectedType,
    topic: data.prompt,
    tone: data.tone,
    audience: data.audience,
    keywords: data.keywords,
    length: data.length,
    model: data.model,
    variationMode: true,
  });

  const parts =
    typeof result?.content === "string"
      ? result.content
          .split(/===\s*VARIATION\s*[A-Z]\s*===/i)
          .map(v => v.trim())
          .filter(v => v.length > 50)
      : [];

  setVariations(
    parts.length
      ? parts
      : ["No structured variations returned. Try again."]
  );
}}


                onSubmit={(userText, params) => {
                  setMessages((prev) => {
                    const updated = [...prev];
                    const feedbackMemory = JSON.parse(localStorage.getItem("ai_feedback")) || {};

                    const likes = Object.values(feedbackMemory)
                      .filter((f) => f.type === "up")
                      .map((f) => f.contentType);

                    const dislikes = Object.values(feedbackMemory)
                      .filter((f) => f.type === "down")
                      .map((f) => f.contentType);

                    // ✅ FIX: REPLACE last user instead of pushing new
                    if (
                      updated.length &&
                      updated[updated.length - 1].role === "user"
                    ) {
                      updated[updated.length - 1] = {
                        role: "user",
                        content: userText,
                        meta: { type: selectedType, ...params },
                      };
                    } else {
                      updated.push({
                        role: "user",
                        content: userText,
                        meta: { type: selectedType, ...params },
                      });
                    }

                    // assistant loader
                    updated.push({
                      role: "assistant",
                      content: "",
                    });

                    return updated;
                  });
                }}
                onResult={(aiText) => {
  setMessages((prev) => {
    const updated = [...prev];
    const idx = updated.findIndex(
      (m) => m.role === "assistant" && m.content === ""
    );

    if (idx !== -1) {
      updated[idx] = {
        role: "assistant",
        content: aiText,
        id: crypto.randomUUID(), // ✅ UNIQUE ID
        createdAt: Date.now(),
      };
    }
    return updated;
  });

  setShowSuccessToast(true);
  setTimeout(() => setShowSuccessToast(false), 2500);
}}


              />
            </div>
          </div>
        </div>
      </main>
  

      <Toast
  show={showSuccessToast}
  message="Content generated successfully"
/>

    </div>
  );
}
