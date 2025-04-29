// src/components/SentimentAnalyzer.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Sentiment from 'sentiment';

// Install these if you haven't:
// npm install axios sentiment framer-motion

const API_KEY = '728c92ad27d6b9a935733655f3e7f562'; // GNews key

export default function SentimentAnalyzer({ stockName = "Tesla" }) {
  const [sentimentScore, setSentimentScore] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const stockNameMap = {
        "GOOGL": "Google",
        "NVDA": "Nvidia",
        "SPY": "S&P 500 ETF",
        "VOO": "S&P 500 ETF",
        "VFIAX": "Vanguard 500 Index Fund",
        "VSMPX": "Vanguard Total Stock Market Index Fund",
        "TSLA": "Tesla",
        "META": "Meta",
        "AMZN": "Amazon",
        "MSFT": "Microsoft",
        "JEPI": "JPMorgan",
        "JNJ": "Johnson and Johnson Inc",
      };
      
      async function getSentiment() {
        setLoading(true);
        setError("");
      
        try {
          const actualSearchName = stockNameMap[stockName] || stockName;
          const response = await axios.get(`https://gnews.io/api/v4/search?q=${encodeURIComponent(actualSearchName)}&lang=en&token=${API_KEY}`);
          const articles = response.data.articles;
      
          if (!articles.length) {
            setError("No news articles found for this stock.");
            setSentimentScore(null);
            return;
          }
      
          const sentiment = new Sentiment();
          let totalComparativeScore = 0;
      
          articles.forEach(article => {
            const text = (article.title || "") + " " + (article.description || "");
            const result = sentiment.analyze(text);
            totalComparativeScore += result.comparative;
          });
      
          const averageComparativeScore = totalComparativeScore / articles.length;
          setSentimentScore(averageComparativeScore);
      
          if (averageComparativeScore > 0.1) setSuggestion("✅ Good to Invest");
          else if (averageComparativeScore < -0.1) setSuggestion("❌ Bad to Invest");
          else setSuggestion("⚖️ Neutral - Research More");
      
        } catch (err) {
          console.error("Error fetching news:", err);
          setError("Failed to fetch sentiment data.");
        } finally {
          setLoading(false);
        }
      }      

    getSentiment();
  }, [stockName]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        background: "#f8f8f8",
        padding: "20px",
        marginTop: "20px",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)"
      }}
    >
      <h2>Stock Sentiment Analysis</h2>
      {loading ? (
        <p>Loading sentiment...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <p style={{ fontSize: "1.5rem", margin: "10px 0" }}>
            Sentiment Score: <strong>{sentimentScore > 0 ? "+" : ""}{sentimentScore.toFixed(2)}</strong>
          </p>
          <p style={{ fontSize: "1.2rem", color: sentimentScore > 0 ? "green" : (sentimentScore < 0 ? "red" : "gray") }}>
            {suggestion}
          </p>
        </>
      )}
    </motion.div>
  );
}
