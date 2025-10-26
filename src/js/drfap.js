const CONFIG = {
OLLAMA_HOST: 'http://localhost:11434',
MODEL: 'mistral',
TEMPERATURE: 0.7,
MAX_TOKENS: 512,
TIMEOUT: 30000
};
class DrFAP_AI {
constructor() {
    this.conversationHistory = [];
    this.isGenerating = false;
    this.setupEventListeners();
    this.initialize();
}
async initialize() {
    this.addMessage("Dr. FAP: Iniciando sistemas... ⚙️", "bot");
    try {
    const models = await this.fetchOllamaModels();
    if (!models.includes(CONFIG.MODEL)) {
        throw new Error(`Modelo ${CONFIG.MODEL} não encontrado`);
    }
    this.addMessage("Dr. FAP: Pronto para conversar! 😊", "bot");
    } catch (error) {
    console.error("Erro na inicialização:", error);
    this.handleError(error);
    }
}
async generateResponse(prompt) {
    if (this.isGenerating) return;
    this.isGenerating = true;
    this.addMessage(prompt, "user");
    const typingMsg = this.addMessage("Dr. FAP: Pensando...", "bot");
    try {
    const response = await this.fetchAIResponse(prompt);
    typingMsg.querySelector(".message-content").textContent = response;
    this.conversationHistory.push({ role: "user", content: prompt });
    this.conversationHistory.push({ role: "assistant", content: response });
    } catch (error) {
    console.error("Erro na geração:", error);
    typingMsg.querySelector(".message-content").textContent = 
        "Dr. FAP: Ops! Erro ao processar. Tente novamente.";
    } finally {
    this.isGenerating = false;
    }
}
async fetchAIResponse(prompt) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);
    try {
    const response = await fetch(`${CONFIG.OLLAMA_HOST}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        model: CONFIG.MODEL,
        prompt: this.buildPrompt(prompt),
        stream: false,
        options: {
            temperature: CONFIG.TEMPERATURE,
            num_predict: CONFIG.MAX_TOKENS
        }
        }),
        signal: controller.signal
    });
    clearTimeout(timeout);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.response;
    } catch (error) {
    if (error.name === 'AbortError') {
        throw new Error("Tempo de resposta excedido");
    }
    throw error;
    }
}
async fetchOllamaModels() {
    const response = await fetch(`${CONFIG.OLLAMA_HOST}/api/tags`);
    if (!response.ok) throw new Error("Ollama não respondeu");
    const data = await response.json();
    return data.models.map(model => model.name.split(":")[0]);
}
buildPrompt(prompt) {
    let context = `Você é o Dr. FAP, IA especializada em jogos e tecnologia da FGP.
    Data atual: ${new Date().toLocaleDateString()}.
    Seja conciso, útil e amigável.\n\nHistórico:\n`;
    this.conversationHistory.slice(-6).forEach(msg => {
    context += `${msg.role === "user" ? "Usuário" : "Dr. FAP"}: ${msg.content}\n`;
    });
    return `${context}\nUsuário: ${prompt}\nDr. FAP:`;
}
addMessage(text, type) {
    const chatBox = document.getElementById("chat-box");
    const message = document.createElement("div");
    message.className = `${type}-message`;
    message.innerHTML = `
    <div class="message-content">${text}</div>
    <div class="timestamp">${new Date().toLocaleTimeString()}</div>
    `;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
    return message;
}
handleError(error) {
    const errorMessages = {
    "Modelo não encontrado": `Dr. FAP: Erro - Modelo '${CONFIG.MODEL}' não instalado. Use: <code>ollama pull ${CONFIG.MODEL}</code>`,
    "Ollama não respondeu": "Dr. FAP: Servidor Ollama offline. Inicie com: <code>ollama serve</code>",
    "default": "Dr. FAP: Sistema temporariamente indisponível 🛠️"
    };
    const message = errorMessages[error.message] || errorMessages.default;
    this.addMessage(message, "bot");
}
setupEventListeners() {
    document.getElementById("send-btn").addEventListener("click", () => {
    const input = document.getElementById("user-input");
    this.generateResponse(input.value.trim());
    input.value = "";
    });
    document.getElementById("user-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const input = document.getElementById("user-input");
        this.generateResponse(input.value.trim());
        input.value = "";
    }
    });
}
}
window.addEventListener("DOMContentLoaded", () => {
new DrFAP_AI();
});