const STORAGE_KEY = "creator_chat_history";

/* ================= GET ALL CHATS ================= */
export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    console.error("Failed to parse history:", error);
    return [];
  }
}

/* ================= CREATE CHAT IF NOT EXISTS ================= */
export function createChatIfNotExists(chatId, title, type) {
  const history = getHistory();

  // If chat already exists, return existing chatId
  const existing = history.find((c) => c.chatId === chatId);
  if (existing) return chatId;

  // Create new chat
  const newChatId = chatId || Date.now().toString();

  const newChat = {
    chatId: newChatId,
    title: title || "Untitled chat",
    type: type || "General",
    createdAt: new Date().toISOString(),
    messages: [],
  };

  history.unshift(newChat); // newest on top
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

  return newChatId;
}

/* ================= SAVE MESSAGE (🔥 FIXED) ================= */
export function saveChatMessage({
  chatId,
  role,        // "user" | "assistant"
  content,
  meta = null, // 🔥 IMPORTANT: STORE USER PREFS
}) {
  const history = getHistory();
  const chat = history.find((c) => c.chatId === chatId);

  if (!chat) return;

  chat.messages.push({
    messageId: Date.now(),
    role,
    content,
    meta, // ✅ PERSIST META
    createdAt: new Date().toISOString(),
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

/* ================= UPDATE CHAT TITLE ================= */
export function updateChatTitle(chatId, title) {
  if (!title) return;

  const history = getHistory();
  const chat = history.find((c) => c.chatId === chatId);

  // Update only if still default
  if (chat && chat.title === "Untitled chat") {
    chat.title = title;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }
}

/* ================= GET SINGLE CHAT ================= */
export function getChatById(chatId) {
  return getHistory().find((c) => c.chatId === chatId);
}

/* ================= DELETE SINGLE CHAT ================= */
export function deleteChat(chatId) {
  const updated = getHistory().filter((c) => c.chatId !== chatId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

/* ================= CLEAR ALL HISTORY ================= */
export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
