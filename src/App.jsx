import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [menuText, setMenuText] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const parseMenu = () => {
    const lines = menuText.split('\n').filter(line => line.includes(':'));
    const items = lines.map(line => {
      const [name, ...desc] = line.split(':');
      return { name: name.trim(), description: desc.join(':').trim() };
    });
    setMenuItems(items);
    setImages([]);
  };

  const generateImages = async () => {
    setLoading(true);
    const newImages = [];
    for (const item of menuItems) {
      try {
        const res = await axios.post('/api/generate', {
          prompt: `Photo of ${item.description}`
        });
        newImages.push(res.data.url);
      } catch (err) {
        newImages.push(null);
      }
    }
    setImages(newImages);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Menu Image Generator</h1>
      <textarea
        className="w-full p-2 border rounded"
        rows={6}
        placeholder="Paste your menu here. E.g.\nGrilled Chicken: Juicy grilled chicken with herbs"
        value={menuText}
        onChange={(e) => setMenuText(e.target.value)}
      ></textarea>
      <button onClick={parseMenu} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
        Parse Menu
      </button>
      {menuItems.length > 0 && (
        <button onClick={generateImages} className="ml-2 mt-2 px-4 py-2 bg-green-600 text-white rounded">
          {loading ? 'Generating...' : 'Generate Images'}
        </button>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {menuItems.map((item, i) => (
          <div key={i} className="border p-3 rounded bg-white shadow">
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-sm mb-2">{item.description}</p>
            {images[i] ? (
              <img src={images[i]} alt={item.name} className="rounded" />
            ) : (
              <p className="text-red-500">Image not available</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
