export async function askOllama(question) {
  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unknown server error");
    }

    return data.answer;
  } catch (error) {
    console.error("❌ Ollama request failed:", error);
    return `Error: ${error.message}`; // 👈 shows full error in UI
  }
}
