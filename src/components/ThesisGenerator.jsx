import { useState, useEffect } from "react";

const ThesisGenerator = () => {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState({ thesis: "", sources: [] });
  const [paragraph, setParagraph] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiReady, setAiReady] = useState(false);

  useEffect(() => {
    const checkReady = setInterval(() => {
      if (window.puter && window.puter.ai && typeof window.puter.ai.chat === "function") {
        setAiReady(true);
        clearInterval(checkReady);
      }
    }, 300);
    return () => clearInterval(checkReady);
  }, []);

  const generateThesis = async () => {
    if (!topic) return;
    setLoading(true);
    setResult({ thesis: "", sources: [] });
    setParagraph("");
    setError("");

    try {
      const response = await window.puter.ai.chat(`
You are DraftMate. 
1. Generate a one-sentence thesis for this topic: ${topic}.
2. Provide 10 credible sources in proper MLA format for a "Works Cited" section.
   - Each source must include: Author(s). Title. Publisher, Year. URL (if applicable).
   - Number them 1 to 10.
3. Output only the thesis and the sources in order, properly formatted for MLA.
      `);

      const content = response?.message?.content || response?.content || JSON.stringify(response);
      const lines = content.split("\n").filter((line) => line.trim() !== "");

      const firstSourceIndex = lines.findIndex((line) => /^\d+\.\s/.test(line));
      const thesisLines = firstSourceIndex > 0 ? lines.slice(0, firstSourceIndex) : [lines[0]];
      const thesisLine = thesisLines.join(" ").trim();

      const sourceLines = firstSourceIndex >= 0 ? lines.slice(firstSourceIndex) : [];
      const sources = sourceLines.map((line) => {
        const match = line.match(/^\d+\.\s*(.*)$/);
        return { text: match ? match[1].trim() : line.trim() };
      });

      setResult({ thesis: thesisLine, sources });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const generateParagraph = async () => {
    if (!result.thesis || result.sources.length === 0) return;
    setLoading(true);
    setParagraph("");
    setError("");

    try {
      const sourcesText = result.sources.map((s, i) => `${i + 1}. ${s.text}`).join("\n");

      const response = await window.puter.ai.chat(`
You are DraftMate. 
Write a single cohesive paragraph about the topic using this thesis: "${result.thesis}".
Use **only 2 sentences with direct quotes** from the MLA sources as evidence:
- First evidence sentence → quote + MLA in-text citation
- Reasoning sentence 1 → explain how evidence supports thesis
- Reasoning sentence 2 → further analysis
- Second evidence sentence → quote + MLA in-text citation
- Reasoning sentence 1 → explain evidence
- Reasoning sentence 2 → further analysis
- Concluding sentence → summarize paragraph

Use proper MLA in-text citations matching the provided sources. Include quotes exactly as they appear in the sources. Do not cite anything else. Make it clear which sentences are evidence sentences.  

Works Cited:
${sourcesText}
      `);

      const content = response?.message?.content || response?.content || JSON.stringify(response);
      setParagraph(content);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-8 p-6 bg-white rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Thesis Generator + MLA Paragraph</h2>

      <div
        className={`px-4 py-2 rounded-full text-sm mb-4 text-center ${
          aiReady
            ? "bg-green-500/20 text-green-300 border border-green-500/30"
            : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
        }`}
      >
        {aiReady ? "🟢 AI Ready" : "🟡 Waiting for AI..."}
      </div>

      <textarea
        className="w-full h-32 p-4 mb-4 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="Enter essay topic..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        disabled={!aiReady}
      />

      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={generateThesis}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-80 text-white font-semibold rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!aiReady || loading || !topic.trim()}
        >
          {loading ? "Generating Thesis..." : "Generate Thesis + Sources"}
        </button>

        <button
          onClick={generateParagraph}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-80 text-white font-semibold rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!result.thesis || result.sources.length === 0 || loading}
        >
          {loading ? "Generating Paragraph..." : "Generate Paragraph (MLA Quotes)"}
        </button>
      </div>

      {result.thesis && (
        <div className="p-4 bg-gray-100 rounded-xl text-gray-800 whitespace-pre-wrap mb-4">
          <h3 className="font-bold mb-2">Thesis:</h3>
          <p>{result.thesis}</p>
        </div>
      )}

      {result.sources.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-xl text-gray-800 whitespace-pre-wrap mb-4">
          <h3 className="font-bold mb-2">Works Cited (MLA):</h3>
          {result.sources.map((source, index) => (
            <p key={index} className="mb-1">
              {index + 1}. {source.text}
            </p>
          ))}
        </div>
      )}

      {paragraph && (
        <div className="p-4 bg-gray-50 rounded-xl text-gray-800 whitespace-pre-wrap mb-4">
          <h3 className="font-bold mb-2">Generated Paragraph (MLA Quotes)</h3>
          <p>{paragraph}</p>
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
