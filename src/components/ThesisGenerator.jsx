import { useState, useEffect, useRef } from "react";

const ThesisGenerator = () => {
  const [topic, setTopic] = useState("");
  const [title, setTitle] = useState("");
  const [sources, setSources] = useState([]);
  const [essay, setEssay] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiReady, setAiReady] = useState(false);
  const [essayOptions, setEssayOptions] = useState({
    audience: "General",
    type: "Expository",
  });

  const debounceRef = useRef(null);

  useEffect(() => {
    const checkReady = setInterval(() => {
      if (window.puter && window.puter.ai && typeof window.puter.ai.chat === "function") {
        setAiReady(true);
        clearInterval(checkReady);
      }
    }, 300);
    return () => clearInterval(checkReady);
  }, []);

  useEffect(() => {
    if (!topic.trim()) {
      setTitle("");
      setSources([]);
      setEssay([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const response = await window.puter.ai.chat(`
You are DraftMate.
1. Generate a catchy essay title for the topic: "${topic}".
2. Provide 10 credible sources in MLA format, prioritizing 2025, then 2024, then 2023 if nothing else is available.
   - Format: Author(s). Title. Publisher, Year. URL
   - Number them 1–10
3. Output only the title and sources (exclude the word "Thesis").
        `);

        const content = response?.message?.content || response?.content || "";
        const lines = content.split("\n").map(l => l.trim()).filter(l => l);

        const generatedTitle = lines.find(line => line && !line.toLowerCase().includes("sources")) || "";
        setTitle(generatedTitle);

        const sourceLines = lines
          .filter(line => /^\d+\.\s+/.test(line))
          .map(line => {
            const match = line.match(/^\d+\.\s*(.*)$/);
            return { text: match ? match[1].trim() : line.trim() };
          })
          .filter(line => line.text);
        setSources(sourceLines);

      } catch (err) {
        setError(err.message || "Something went wrong while generating title/sources");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [topic]);

  const generateEssay = async () => {
    if (!title || sources.length === 0) return;
    setLoading(true);
    setEssay([]);
    setError("");

    try {
      const sourcesText = sources.map((s, i) => `${i + 1}. ${s.text}`).join("\n");

      const response = await window.puter.ai.chat(`
You are DraftMate.
Write a full essay for the topic "${topic}" with the title "${title}".
- Structure it properly: Introduction, multiple Body Paragraphs, and Conclusion.
- Use the sources below with at least 2 sentences of direct quotes for evidence.
- Correct grammar and spelling.
- Split the essay into multiple paragraphs for readability.
- Do not include headings for each paragraph.
- Only quote from the sources below.

Works Cited:
${sourcesText}
      `);

      const content = response?.message?.content || response?.content || "";
      setEssay(content.split(/\n{2,}/).map(p => p.trim()).filter(p => p));

    } catch (err) {
      setError(err.message || "Something went wrong while generating the essay");
    } finally {
      setLoading(false);
    }
  };

  const linkify = (text) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s)]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (!part) return null;
      const match = part.match(/^(https?:\/\/[^\s)]+?)([.,)]+)?$/);
      if (match) {
        const url = match[1];
        const trailing = match[2] || "";
        return (
          <span key={i}>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              {url}
            </a>
            {trailing}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">DraftMate Essay Generator</h2>

      <div className={`px-4 py-2 rounded-full text-sm mb-4 text-center ${
        aiReady ? "bg-green-500/20 text-green-300 border border-green-500/30" :
                  "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
      }`}>
        {aiReady ? "🟢 AI Ready" : "🟡 Waiting for AI..."}
      </div>

      <textarea
        className="w-full h-32 p-4 mb-4 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="Enter essay topic..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        disabled={!aiReady}
      />

      {loading && (
        <div className="text-center mb-4 text-gray-600">Generating AI content...</div>
      )}

      {title && (
        <div className="p-4 bg-gray-100 rounded-xl text-gray-800 whitespace-pre-wrap mb-4">
          <h3 className="font-bold mb-2">Essay Title:</h3>
          <p>{title}</p>
        </div>
      )}

      {sources.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-xl text-gray-800 whitespace-pre-wrap mb-4">
          <h3 className="font-bold mb-2">Works Cited (MLA):</h3>
          {sources.map((source, index) => (
            <p key={index} className="mb-1">{index + 1}. {linkify(source.text)}</p>
          ))}
        </div>
      )}

      {title && sources.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <label className="font-medium">Audience:</label>
            <select
              className="border border-gray-300 rounded-lg px-2 py-1"
              value={essayOptions.audience}
              onChange={(e) => setEssayOptions({ ...essayOptions, audience: e.target.value })}
            >
              <option>General</option>
              <option>Academic</option>
              <option>Professional</option>
              <option>Young Adult</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <label className="font-medium">Essay Type:</label>
            <select
              className="border border-gray-300 rounded-lg px-2 py-1"
              value={essayOptions.type}
              onChange={(e) => setEssayOptions({ ...essayOptions, type: e.target.value })}
            >
              <option>Expository</option>
              <option>Narrative</option>
              <option>Persuasive</option>
              <option>Descriptive</option>
            </select>
          </div>

          <button
            onClick={generateEssay}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-80 text-white font-semibold rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Generating Essay..." : "Generate Full Essay"}
          </button>
        </div>
      )}

      {essay.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-xl text-gray-800 whitespace-pre-wrap mb-4">
          {essay.map((p, i) => (
            <p key={i} className="mb-4">{linkify(p)}</p>
          ))}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-xl border border-red-300 mt-4">
          {error}
        </div>
      )}
    </div>
  );
};

export default ThesisGenerator;
