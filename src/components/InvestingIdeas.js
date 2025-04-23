import React, { useState } from "react";
import { askOllama } from "../askOllama";

export default function InvestingIdeas() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    const answer = await askOllama(question); // ⬅️ cleaner function call
    setResponse(answer);
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h2>💡 Investing Ideas</h2>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask about investing ideas..."
        style={{ width: "60%", padding: "0.5rem" }}
      />
      <button onClick={handleAsk} style={{ marginLeft: "1rem" }}>
        Ask
      </button>
      <div style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>
        {loading ? "Thinking..." : response}
      </div>
    </div>
  );
}
