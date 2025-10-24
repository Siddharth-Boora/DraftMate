import { useState, useEffect } from "react";

const ThesisGenerator = () => {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [wordCount, setWordCount] = useState("");
  const [result, setResult] = useState({ title: "", sources: [] });
  const [article, setArticle] = useState("");
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

  const generateTitleAndSources = async () => {
    if (!topic) return;
    setLoading(true);
    setResult({ title: "", sources: [] });
    setArticle("");
    setError("");

    try {
      const response = await window.puter.ai.chat(`
You are DraftMate. 
1. Generate a compelling article title for this topic: ${topic}.
2. Provide 10 credible sources in proper MLA format for a "Works Cited" section.
   - Each source must include: Author(s). Title. Publisher, Year. URL (if applicable).
   - Number them 1 to 10.
3. Output only the title and the sources in order, properly formatted for MLA.
      `);

      const content = response?.message?.content || response?.content || JSON.stringify(response);
      const lines = content.split("\n").filter((line) => line.trim() !== "");
      const firstSourceIndex = lines.findIndex((line) => /^\d+\.\s/.test(line));
      const titleLine = firstSourceIndex > 0 ? lines.slice(0, firstSourceIndex).join(" ").trim() : lines[0];
      const sourceLines = firstSourceIndex >= 0 ? lines.slice(firstSourceIndex) : [];
      const sources = sourceLines.map((line) => {
        const match = line.match(/^\d+\.\s*(.*)$/);
        return { text: match ? match[1].trim() : line.trim() };
      });

      setResult({ title: titleLine, sources });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const generateArticle = async () => {
    if (!result.title || result.sources.length === 0 || !audience || !wordCount) return;
    setLoading(true);
    setArticle("");
    setError("");

    try {
      const sourcesText = result.sources.map((s, i) => `${i + 1}. ${s.text}`).join("\n");
      const response = await window.puter.ai.chat(`
You are DraftMate, a world-class SEO content writer.
ARTICLE TYPE: offsite article/blog post
TARGET AUDIENCE: ${audience}
NUMBER OF WORDS: ${wordCount}

Write an article based on this title: "${result.title}"
Follow this structure:
1. Hook/introduction related to the title.
2. Body paragraphs that include 2 direct MLA-cited quotes from the sources below.
3. Logical transitions, emotional resonance, and human-like rhythm.
4. Conversational, spontaneous tone as described in the style guide.
5. Concluding paragraph that ties everything together naturally.

Use proper MLA in-text citations (Author Last Name, Title).
Here are the sources:
${sourcesText}
      `);
      const content = response?.message?.content || response?.content || JSON.stringify(response);
      setArticle(content);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const linkify = (text) => {
    if (!text) return null;
    const urlSplitRegex = /(https?:\/\/[^\s)]+)/g;
    return text.split(urlSplitRegex).map((part, i) => {
      if (!part) return null;
      const urlMatch = part.match(/^(https?:\/\/[^\s)]+?)([.,)]+)?$/);
      if (urlMatch) {
        const url = urlMatch[1];
        const trailing = urlMatch[2] || "";
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
    <div className="max-w-3xl mx-auto my-8 p-6 bg-white rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Article Generator + MLA</h2>
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
          onClick={generateTitleAndSources}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-80 text-white font-semibold rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!aiReady || loading || !topic.trim()}
        >
          {loading ? "Generating Title..." : "Generate Title + Sources"}
        </button>
      </div>

      {result.title && (
        <div className="p-4 bg-gray-100 rounded-xl text-gray-800 whitespace-pre-wrap mb-4">
          <h3 className="font-bold mb-2">Generated Title:</h3>
          <p>{result.title}</p>
        </div>
      )}

      {result.sources.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-xl text-gray-800 whitespace-pre-wrap mb-6">
          <h3 className="font-bold mb-2">Works Cited (MLA):</h3>
          {result.sources.map((source, index) => (
            <p key={index} className="mb-1">
              {index + 1}. {linkify(source.text)}
            </p>
          ))}
        </div>
      )}

      {result.title && result.sources.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
          <select
            className="p-3 border border-gray-300 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-500"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          >
            <option value="">Select Target Audience</option>
            <option value="college students">College Students</option>
            <option value="researchers">Researchers</option>
            <option value="teachers">Teachers</option>
            <option value="blog readers">Blog Readers</option>
            <option value="general audience">General Audience</option>
          </select>

          <select
            className="p-3 border border-gray-300 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-500"
            value={wordCount}
            onChange={(e) => setWordCount(e.target.value)}
          >
            <option value="">Select Word Count</option>
            <option value="500">500 Words</option>
            <option value="1000">1000 Words</option>
            <option value="1500">1500 Words</option>
          </select>

          <button
            onClick={generateArticle}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-80 text-white font-semibold rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!audience || !wordCount || loading}
          >
            {loading ? "Generating Article..." : "Generate Full Article"}
          </button>
        </div>
      )}

      {article && (
        <div className="p-4 bg-gray-50 rounded-xl text-gray-800 whitespace-pre-wrap mb-4">
          <h3 className="font-bold mb-2">Generated Article</h3>
          <p>{linkify(article)}</p>
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
