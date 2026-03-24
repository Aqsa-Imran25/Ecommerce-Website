import { useState } from "react";
import axios from "axios";
import { apiUrl, UserToken } from "../components/common/Http";
import { Link } from "react-router-dom";
import striptags from "striptags";

export default function AIChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newUserMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newUserMessage]);

    setInput("");

    try {
      const res = await axios.post(
        `${apiUrl}/ai/chat`,
        { message: input },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${UserToken()}`, // ✅ ADD THIS

          },
        }
      );

      const aiMessage = { sender: "ai", text: res.data.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage = { sender: "ai", text: "Error: Try again later" };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>AI Shopping Assistant</h2>

      {/* Chat Window */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "350px",
          overflowY: "scroll",
          marginBottom: "10px",
        }}
      >

        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
            <b>{msg.sender === "user" ? "You:" : "AI:"}</b>{" "}
            {msg.sender === "ai" && msg.text.includes("Id:") ? (
              msg.text
                .split("\n\n")
                .filter(section => section.trim().startsWith("Id:"))
                .map((item, i) => {
                  const lines = item.split("\n");
                  const idLine = lines.find(l => l.startsWith("Id:")) || "";
                  const titleLine = lines.find(l => l.startsWith("Title:")) || "";
                  const priceLine = lines.find(l => l.startsWith("Price:")) || "";
                  const descLine = lines.find(l => l.startsWith("Description:")) || "";
                  const imgLine = lines.find(l => l.startsWith("Image:")) || "";

                  const id = idLine.replace("Id:", "").trim();
                  const title = titleLine.replace("Title:", "").trim();
                  const price = priceLine?.replace("Price:", "").trim() || "0";
                  const description = descLine.replace("Description:", "").trim();
                  const rawImg = imgLine?.replace("Image:", "").trim() || "";
                  const finalImageUrl = rawImg.match(/^https?:\/\//)
                    ? rawImg
                    : "/fallback.png";

                  console.log("finalImageUrl: ", finalImageUrl);
                  return (
                    <div key={i} style={{ border: "1px solid #eee", borderRadius: "12px", padding: "12px", margin: "8px 0", background: "#fff" }}>
                      <Link to={`/product/${id}`}>
                        <img
                          src={finalImageUrl}
                          alt={title}
                          onError={(e) => (e.target.src = "/fallback.png")}
                          style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "8px", cursor: "pointer" }}
                        />
                      </Link>
                      <h3>{title}</h3>
                      <p style={{ color: "#28a745", fontWeight: "bold" }}>Rs {price}</p>
                      <p style={{ fontSize: "14px", color: "#555" }}>
                        {striptags(description)}
                      </p>
                    </div>
                  );
                })
            ) : (
              <span>{msg.text}</span>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about products or shopping questions"
        style={{ width: "80%", padding: "8px" }}
      />

      <button
        onClick={sendMessage}
        style={{
          padding: "8px 12px",
          marginLeft: "5px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </div>
  );
}