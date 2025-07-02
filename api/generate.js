export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { prompt } = req.body;

  if (!prompt || prompt.length < 5) {
    return res.status(400).json({ error: "Invalid prompt" });
  }

  const fullPrompt = `Realistic high-quality food photo of: ${prompt}. Plated dish, professional lighting, top-down angle, detailed ingredients.`;

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        model: "dall-e-2",
        n: 1,
        size: "1024x1024",
      }),
    });

    const data = await response.json();

    if (response.ok && data?.data?.[0]?.url) {
      return res.status(200).json({ url: data.data[0].url });
    } else {
      console.error("OpenAI image generation error:", data);
      return res.status(500).json({ error: data });
    }
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Image generation failed" });
  }
}
