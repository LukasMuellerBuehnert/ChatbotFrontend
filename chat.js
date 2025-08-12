const API_URL = "https://chatbotbackend-v5bj.onrender.com/chat";

const chatBox   = document.getElementById("chat");
const form      = document.getElementById("form");
const input     = document.getElementById("msg");
const sendBtn   = document.getElementById("sendBtn");
const chatWin   = document.getElementById("chatWindow");
const chatTgl   = document.getElementById("chatToggle");
const chatClose = document.getElementById("chatClose");

function addMessage(text, who) {
  const wrap = document.createElement("div");
  wrap.className = `flex ${who === "user" ? "justify-end" : "justify-start"}`;
  const bubble = document.createElement("div");
  bubble.className = `max-w-[80%] px-3 py-2 rounded-2xl text-sm shadow
    ${who === "user"
       ? "bg-blue-600 text-white rounded-br-none"
       : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"}`;
  bubble.textContent = text;
  wrap.appendChild(bubble);
  chatBox.appendChild(wrap);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage(text) {
  addMessage(text, "user");
  input.value = "";
  input.disabled = true; sendBtn.disabled = true;

  const typing = document.createElement("div");
  typing.className = "text-xs text-gray-500";
  typing.textContent = "Bot tippt…";
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    typing.remove();
    addMessage(data.answer || "Fehler.", "bot");

    if (data.debug) console.log("[DEBUG]", data.debug);
  } catch {
    typing.remove();
    addMessage("Netzwerkfehler oder CORS blockiert.", "bot");
  } finally {
    input.disabled = false; sendBtn.disabled = false; input.focus();
  }
}

function greetOnce() {
  if (!chatBox.dataset.greeted) {
    addMessage("Hi! Wie kann ich helfen?", "bot");
    chatBox.dataset.greeted = "1";
  }
}

function openChat() { chatWin.classList.remove("hidden"); greetOnce(); input.focus(); }
function closeChat(){ chatWin.classList.add("hidden"); }

chatTgl.addEventListener("click", () =>
  chatWin.classList.contains("hidden") ? openChat() : closeChat()
);
chatClose.addEventListener("click", closeChat);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text) sendMessage(text);
});
