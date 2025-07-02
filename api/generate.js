export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { prompt } = req.body;

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      prompt: `High-quality photo of: ${prompt}`,
      n: 1,
      size: "512x512",
    }),
  });

  const data = await response.json();

  if (response.ok && data?.data?.[0]?.url) {
    res.status(200).json({ url: data.data[0].url });
  } else {
    res.status(500).json({ error: data });
  }
}
