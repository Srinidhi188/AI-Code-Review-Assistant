import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function App() {
  const [code, setCode] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!code.trim()) return alert("⚠️ Please paste some code first!");
    setLoading(true);
    setResponse("⏳ Analyzing your code...");

    try {
    
     const res = await fetch("https://ai-code-review-backend-6u1r.onrender.com/analyze", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      setResponse(data.review || "❌ Something went wrong!");
    } catch (error) {
      console.error("Error:", error);
      setResponse("⚠️ Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    alert("✅ Review copied to clipboard!");
  };

  const handleClear = () => {
    setCode("");
    setResponse("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0d1117",
        color: "#e6edf3",
        fontFamily: "Inter, sans-serif",
        padding: "40px",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#58a6ff" }}>
        🧠 AI Code Review Assistant
      </h2>

      <textarea
        rows="10"
        cols="80"
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #30363d",
          backgroundColor: "#161b22",
          color: "#e6edf3",
          marginBottom: "20px",
          fontFamily: "monospace",
          fontSize: "15px",
        }}
      />

      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            backgroundColor: "#238636",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
        <button
          onClick={handleCopy}
          disabled={!response}
          style={{
            backgroundColor: "#58a6ff",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Copy Feedback
        </button>
        <button
          onClick={handleClear}
          style={{
            backgroundColor: "#f85149",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "#161b22",
          borderRadius: "10px",
          border: "1px solid #30363d",
        }}
      >
        <h3 style={{ color: "#58a6ff" }}>Result:</h3>
        <ReactMarkdown
          children={response}
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code
                  style={{
                    backgroundColor: "#30363d",
                    padding: "2px 5px",
                    borderRadius: "4px",
                  }}
                  {...props}
                >
                  {children}
                </code>
              );
            },
          }}
        />
      </div>
    </div>
  );
}

export default App;
