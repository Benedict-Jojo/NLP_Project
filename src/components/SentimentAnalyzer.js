import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';


const API_KEY = process.env.REACT_APP_GNEWS_API_KEY; // GNews key


export default function SentimentAnalyzer({ stockName = "Tesla" }) {
  const [sentimentScore, setSentimentScore] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fallbackMessage, setFallbackMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const stockNameMap = {
      "GOOGL": "Google",
      "NVDA": "Nvidia",
      "VSMPX": "Vanguard Total Stock Market Index Fund",
      "TSLA": "Tesla",
      "META": "Meta",
      "AMZN": "Amazon",
      "MSFT": "Microsoft",
      "JEPI": "JPMorgan",
      "JNJ": "Johnson and Johnson Inc",
      "FXIX": "Fidelity",
      "VOO": "Vanguard 500 Index",
      "FXAIX": "Fidelity",
      "JPST": "JPMorgan",
      "SPY": "Spyder",
      "VFIAX": "Vanguard",
    };

    const fallbackMap = {
      "SPY": "S%26P+500",
      "JPST": "Bond+Market",
      "JEPI": "Covered+Call+ETF",
    };

    async function getSentiment() {
      setLoading(true);
      setError("");
      setFallbackMessage("");
      setArticles([]);
      setKeywords([]);

      const actualSearchName = stockNameMap[stockName] || stockName;
      const fallbackSearch = fallbackMap[stockName] || "Technology+Stocks";
      let fetchedArticles = [];

      try {
        const response = await axios.get(`https://gnews.io/api/v4/search?q=${encodeURIComponent(actualSearchName)}&lang=en&token=${API_KEY}`);
        fetchedArticles = deduplicateArticles(response.data.articles);

        if (!fetchedArticles.length) {
          const fallbackLabel = decodeURIComponent(fallbackSearch.replace(/\+/g, ' '));
          setFallbackMessage(`⚠️ No clean news found for "${actualSearchName}". Showing results for "${fallbackLabel}".`);
          const fallbackResponse = await axios.get(`https://gnews.io/api/v4/search?q=${fallbackSearch}&lang=en&token=${API_KEY}`);
          fetchedArticles = deduplicateArticles(fallbackResponse.data.articles);
        }

      } catch {
        try {
          const fallbackLabel = decodeURIComponent(fallbackSearch.replace(/\+/g, ' '));
          setFallbackMessage(`⚠️ Could not reach "${actualSearchName}". Showing fallback results for "${fallbackLabel}".`);
          const fallbackResponse = await axios.get(`https://gnews.io/api/v4/search?q=${fallbackSearch}&lang=en&token=${API_KEY}`);
          fetchedArticles = deduplicateArticles(fallbackResponse.data.articles);
        } catch (fallbackError) {
          console.error("Fallback search also failed:", fallbackError);
          setError("❌ Failed to fetch sentiment data.");
          setLoading(false);
          return;
        }
      }

      if (!fetchedArticles.length) {
        setError("❌ No usable articles found.");
        setSentimentScore(null);
        setLoading(false);
        return;
      }

      try {
        let totalScore = 0;
        let allKeywords = [];

        fetchedArticles.forEach(article => {
          const text = (article.title || "") + " " + (article.description || "");
          const result = analyzeSentiment(text);
          totalScore += result.score;
          allKeywords = [...allKeywords, ...result.keywords];
        });

        const averageScore = totalScore / fetchedArticles.length;
        const percentageScore = Math.max(-100, Math.min(100, averageScore * 20));
        setSentimentScore(percentageScore);
        setArticles(fetchedArticles);
        setKeywords([...new Set(allKeywords)]);
        setLastUpdated(new Date().toLocaleTimeString());

        if (percentageScore > 0.3) setSuggestion("✅ Good to Invest");
        else if (percentageScore < -0.3) setSuggestion("❌ Bad to Invest");
        else setSuggestion("⚖️ Neutral - Research More");

      } catch (err) {
        console.error("Sentiment analysis failed:", err);
        setError("❌ Sentiment scoring failed.");
      } finally {
        setLoading(false);
      }
    }

    function deduplicateArticles(rawArticles) {
      const seen = new Set();
      return rawArticles.filter(a => {
        if (!a.title) return false;
        const clean = a.title.trim().toLowerCase().replace(/[^\w\s]/g, "");
        if (seen.has(clean)) return false;
        seen.add(clean);
        return true;
      });
    }

    getSentiment();
    const interval = setInterval(() => getSentiment(), 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [stockName]);

  const confidence = articles.length >= 5 ? "High" : articles.length >= 3 ? "Moderate" : "Low";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        background: "rgba(30, 0, 60, 0.85)",
        color: "#f0f0f0",
        padding: "24px",
        marginTop: "24px",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
        border: "1px solid #e0e0e0",
        maxWidth: "600px",
        marginLeft: "auto",
        marginRight: "auto"
      }}
    >
      <h2 style={{ fontSize: "1.8rem", marginBottom: "8px", color: "white" }}>📈 Sentiment Analysis</h2>

      {fallbackMessage && (
        <div style={{ fontSize: "0.85rem", color: "#b56a00", marginBottom: "12px" }}>{fallbackMessage}</div>
      )}

      {loading ? (
        <p>Loading sentiment...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "10px", color: sentimentScore > 0 ? "green" : sentimentScore < 0 ? "red" : "white" }}>
            {sentimentScore > 0 ? "↑" : sentimentScore < 0 ? "↓" : "→"} {sentimentScore > 0 ? "+" : sentimentScore < 0 ? "−" : ""}{Math.abs(sentimentScore.toFixed(0))}%
          </div>

          <div style={{ fontSize: "1.5rem", marginBottom: "12px", color: "white" }}>{suggestion}</div>

          <div style={{ fontSize: "0.95rem", color: "#777", marginBottom: "16px" }}>
            Confidence: {confidence}
          </div>

          <div style={{ fontSize: "0.8rem", color: "#aaa", marginBottom: "16px" }}>
            Last Updated: {lastUpdated}
          </div>

          <div style={{ textAlign: "left", marginBottom: "20px" }}>
            <h4 style={{ fontSize: "1.2rem", color: "white" }}>📰 Recent Headlines:</h4>
            <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
              {articles.slice(0, 3).map((article, i) => (
                <li key={i} style={{ marginBottom: "10px", fontSize: "0.9rem" }}>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ color: "#66ccff", textDecoration: "none",fontWeight: "700" }}>
                    {article.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: "1.2rem", color: "white", marginBottom: "8px" }}>💬 Keywords:</h4>
            {keywords.length === 0 ? (
              <p style={{ color: "#888", fontSize: "0.9rem" }}>No strong sentiment keywords detected.</p>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" }}>
                {keywords.slice(0, 10).map((word, i) => (
                  <span key={i} style={{
                    background: "#e0e0e0",
                    padding: "6px 12px",
                    borderRadius: "16px",
                    fontSize: "0.9rem",
                    color: "#222",
                    fontWeight: "500"
                  }}>
                    {word}
                  </span>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}

function analyzeSentiment(text) {
  const customTrigrams = {
    "beat earnings expectations": 4,
    "missed earnings forecast": -4,
    "record quarterly profit": 4,
    "reported revenue growth": 3,
    "cut revenue guidance": -3,
    "strong quarterly results": 3,
    "weak quarterly results": -3,
    "raised forward guidance": 3,
    "issued profit warning": -3,
    "surpassed analyst estimates": 3,
    "fell below expectations": -3,
    "revenue fell short": -3,
    "market closed higher": 2,
    "market closed lower": -2
  };

  const customBigrams = {
    "beat earnings": 3,
    "strong earnings": 3,
    "missed forecast": -3,
    "fell short": -2,
    "positive outlook": 2,
    "negative outlook": -2,
    "cut forecast": -2,
    "record profit": 4,
    "record loss": -4,
    "market crash": -5,
    "revenue growth": 3,
    "stock surge": 4,
    "stock plummet": -4,
    "dividend increase": 2,
    "dividend cut": -2,
    "strong quarter": 2,
    "weak quarter": -2,
    "bullish sentiment": 2,
    "bearish sentiment": -2,
    "buy rating": 2,
    "sell rating": -2,
    "profit warning": -3,
    "price target": 1,
    "guidance raise": 2,
    "guidance cut": -2
  };

  const positiveWords = ["profit", "growth", "surge", "gain", "strong", "positive", "beat", "increase", "rise", "improve", "exceed", "optimistic"];
  const negativeWords = ["loss", "decline", "crash", "plummet", "bearish", "missed", "cut", "decrease", "drop", "weaken", "negative", "warning"];

  const clean = text.toLowerCase().replace(/[^\w\s]/g, "");
  const tokens = clean.split(/\s+/);
  let score = 0;
  const seenKeywords = [];

  for (let i = 0; i < tokens.length - 2; i++) {
    const trigram = `${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`;
    if (customTrigrams[trigram]) {
      score += customTrigrams[trigram];
      seenKeywords.push(trigram);
    }
  }

  for (let i = 0; i < tokens.length - 1; i++) {
    const bigram = `${tokens[i]} ${tokens[i + 1]}`;
    if (customBigrams[bigram]) {
      score += customBigrams[bigram];
      seenKeywords.push(bigram);
    }
  }

  tokens.forEach(word => {
    if (positiveWords.includes(word)) {
      score += 1;
      seenKeywords.push(word);
    }
    if (negativeWords.includes(word)) {
      score -= 1;
      seenKeywords.push(word);
    }
  });

  return { score, keywords: seenKeywords };
}
