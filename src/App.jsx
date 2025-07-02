import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [menuText, setMenuText] = useState("");
  const [items, setItems] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  function parseMenu() {
    const lines = menuText.split("\n").filter((line) => line.includes(":"));
    const parsed = lines.map((line) => {
      const [name, ...desc] = line.split(":");
      return { name: name.trim(), description: desc.join(":").trim() };
    });
    setItems(parsed);
    setImages([]); // Clear old images
  }

  async function generateImages() {
    setLoading(true);
    const newImages = [];

    for (const item of items) {
      try {
        const response = await axios.post("/api/generate", {
          prompt: item.description,
        });
        newImages.push(response.data.url);
      } catch (error) {
        newImages.push(null);
      }
    }

    setImages(newImages);
    setLoading(false);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Menu Image Generator</h1>
      <textarea
        rows={6}
        style={{ width: "100%" }}
        placeholder="Paste menu items here (e.g. Grilled Chicken: with lemon herbs)"
        value={menuText}
        onChange={(e) => setMenuText(e.target.value)}
      />
      <button onClick={parseMenu}>Parse Menu</button>
      {items.length > 0 && (
        <button onClick={generateImages} disabled={loading}>
          {loading ? "Generating..." : "Generate Images"}
        </button>
      )}

      <ul>
        {items.map((i, idx) => (
          <li key={idx}>
            <strong>{i.name}:</strong> {i.description} <br />
            {images[idx] ? (
              <img src={images[idx]} alt={i.name} style={{ maxWidth: "300px", marginTop: "10px" }} />
            ) : loading ? null : (
              <em style={{ color: "gray" }}>No image</em>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
